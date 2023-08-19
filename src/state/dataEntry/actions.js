import { Keyboard } from "react-native";
import * as Crypto from "expo-crypto";

if (!global.crypto) {
  global.crypto = Crypto;
}

import {
  Dates,
  NodeDefs,
  NodeDefType,
  RecordFactory,
  Records,
  RecordUpdater,
  Surveys,
} from "@openforis/arena-core";

import { RecordService } from "service/recordService";
import { RecordFileService } from "service/recordFileService";

import { screenKeys } from "screens/screenKeys";
import { i18n } from "localization";

import { SurveySelectors } from "../survey/selectors";
import { DataEntrySelectors } from "./selectors";
import { ConfirmActions } from "state/confirm";

import { exportRecords } from "./dataExportActions";

const RECORD_SET = "RECORD_SET";
const PAGE_SELECTOR_MENU_OPEN_SET = "PAGE_SELECTOR_MENU_OPEN_SET";
const PAGE_ENTITY_SET = "PAGE_ENTITY_SET";
const PAGE_ENTITY_ACTIVE_CHILD_INDEX_SET = "PAGE_ENTITY_ACTIVE_CHILD_INDEX_SET";
const DATA_ENTRY_RESET = "DATA_ENTRY_RESET";

const { t } = i18n;

const getMaxDateModified = (nodes) =>
  Object.values(nodes).reduce((acc, node) => {
    const dateModified = Dates.parseISO(node.dateModified);
    return Math.max(acc, dateModified);
  }, new Date());

const createNewRecord =
  ({ navigation }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const cycle = Surveys.getDefaultCycleKey(survey);
    const recordEmpty = RecordFactory.createInstance({
      surveyUuid: survey.uuid,
      cycle,
      user: {},
    });

    let { record, nodes } = await RecordUpdater.createRootEntity({
      survey,
      record: recordEmpty,
    });

    record.surveyId = survey.id;
    record.dateModified = getMaxDateModified(nodes);

    record = await RecordService.insertRecord({ survey, record });

    dispatch(editRecord({ navigation, record }));
  };

const addNewEntity = async (dispatch, getState) => {
  const state = getState();
  const survey = SurveySelectors.selectCurrentSurvey(state);
  const record = DataEntrySelectors.selectRecord(state);
  const { parentEntityUuid: currentParentNodeUuid, entityDef: nodeDef } =
    DataEntrySelectors.selectCurrentPageEntity(state);

  const parentNode = currentParentNodeUuid
    ? Records.getNodeByUuid(currentParentNodeUuid)(record)
    : Records.getRoot(record);

  const { record: recordUpdated, nodes: nodesCreated } =
    await RecordUpdater.createNodeAndDescendants({
      survey,
      record,
      parentNode,
      nodeDef,
    });

  record.dateModified = getMaxDateModified(nodesCreated);

  const nodeCreated = Object.values(nodesCreated).find(
    (nodeCreated) => nodeCreated.nodeDefUuid === nodeDef.uuid
  );

  await RecordService.updateRecord({ survey, record: recordUpdated });

  dispatch({ type: RECORD_SET, record: recordUpdated });
  dispatch(
    selectCurrentPageEntity({
      parentEntityUuid: parentNode.uuid,
      entityDefUuid: nodeDef.uuid,
      entityUuid: nodeCreated.uuid,
    })
  );
};

const deleteNodes = (nodeUuids) => async (dispatch, getState) => {
  const state = getState();
  const survey = SurveySelectors.selectCurrentSurvey(state);
  const record = DataEntrySelectors.selectRecord(state);

  const { record: recordUpdated, nodes } = await RecordUpdater.deleteNodes({
    survey,
    record,
    nodeUuids,
  });

  record.dateModified = getMaxDateModified(nodes);

  await RecordService.updateRecord({ survey, record: recordUpdated });

  dispatch({ type: RECORD_SET, record: recordUpdated });
};

const deleteRecords = (recordUuids) => async (_dispatch, getState) => {
  const state = getState();
  const survey = SurveySelectors.selectCurrentSurvey(state);

  await RecordService.deleteRecords({ surveyId: survey.id, recordUuids });
};

const editRecord =
  ({ navigation, record }) =>
  (dispatch) => {
    dispatch({ type: RECORD_SET, record });
    navigation.navigate(screenKeys.recordEditor);
  };

const fetchAndEditRecord =
  ({ navigation, recordId }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = await RecordService.fetchRecord({ survey, recordId });
    dispatch(editRecord({ navigation, record }));
  };

const updateAttribute =
  ({ uuid, value, fileUri = null }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);

    const node = Records.getNodeByUuid(uuid)(record);
    const nodeDef = Surveys.getNodeDefByUuid({
      survey,
      uuid: node.nodeDefUuid,
    });

    const { record: recordUpdated, nodes: nodesUpdated } =
      await RecordUpdater.updateAttributeValue({
        survey,
        record,
        attributeUuid: uuid,
        value,
      });

    record.dateModified = getMaxDateModified(nodesUpdated);

    if (NodeDefs.getType(nodeDef) === NodeDefType.file) {
      const surveyId = survey.id;

      if (fileUri) {
        const { fileUuid: fileUuidNext } = value || {};

        await RecordFileService.saveRecordFile({
          surveyId,
          fileUuid: fileUuidNext,
          sourceFileUri: fileUri,
        });
      }

      const { value: valuePrev } = node;
      const { fileUuid: fileUuidPrev } = valuePrev || {};
      if (fileUuidPrev) {
        await RecordFileService.deleteRecordFile({
          surveyId,
          fileUuid: fileUuidPrev,
        });
      }
    }
    await RecordService.updateRecord({ survey, record: recordUpdated });

    dispatch({ type: RECORD_SET, record: recordUpdated });
  };

const addNewAttribute =
  ({ nodeDef, parentNodeUuid, value = null }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);
    const parentNode = Records.getNodeByUuid(parentNodeUuid)(record);

    const { record: recordUpdated, nodes: nodesCreated } =
      await RecordUpdater.createNodeAndDescendants({
        survey,
        record,
        parentNode,
        nodeDef,
      });

    const nodeCreated = Object.values(nodesCreated).find(
      (nodeCreated) => nodeCreated.nodeDefUuid === nodeDef.uuid
    );

    const { record: recordUpdated2 } = await RecordUpdater.updateAttributeValue(
      {
        survey,
        record: recordUpdated,
        attributeUuid: nodeCreated.uuid,
        value,
      }
    );

    await RecordService.updateRecord({ survey, record: recordUpdated2 });

    dispatch({ type: RECORD_SET, record: recordUpdated2 });
  };

const selectCurrentPageEntity =
  ({ parentEntityUuid, entityDefUuid, entityUuid = null }) =>
  (dispatch, getState) => {
    const state = getState();
    const { entityDef: prevEntityDef, entityUuid: prevEntityUuid } =
      DataEntrySelectors.selectCurrentPageEntity(state);

    const nextEntityUuid =
      entityDefUuid === prevEntityDef.uuid && entityUuid === prevEntityUuid
        ? null // set pointer to list of entities
        : entityUuid;

    dispatch({
      type: PAGE_ENTITY_SET,
      parentEntityUuid,
      entityDefUuid,
      entityUuid: nextEntityUuid,
    });
  };

const selectCurrentPageEntityActiveChildIndex = (index) => (dispatch) => {
  dispatch({ type: PAGE_ENTITY_ACTIVE_CHILD_INDEX_SET, index });
};

const toggleRecordPageMenuOpen = (dispatch, getState) => {
  Keyboard.dismiss();
  const state = getState();
  const open = DataEntrySelectors.selectRecordPageSelectorMenuOpen(state);
  dispatch({ type: PAGE_SELECTOR_MENU_OPEN_SET, open: !open });
};

const navigateToRecordsList =
  ({ navigation }) =>
  (dispatch) => {
    dispatch(
      ConfirmActions.show({
        confirmButtonTextKey: "dataEntry:goToListOfRecords",
        messageKey:
          "dataEntry:confirmGoToListOfRecordsAndTerminateRecordEditing",
        onConfirm: () => {
          dispatch({ type: DATA_ENTRY_RESET });
          navigation.navigate(screenKeys.recordsList);
        },
      })
    );
  };

export const DataEntryActions = {
  RECORD_SET,
  PAGE_ENTITY_SET,
  PAGE_ENTITY_ACTIVE_CHILD_INDEX_SET,
  PAGE_SELECTOR_MENU_OPEN_SET,
  DATA_ENTRY_RESET,

  createNewRecord,
  addNewEntity,
  addNewAttribute,
  deleteNodes,
  deleteRecords,
  fetchAndEditRecord,
  updateAttribute,
  selectCurrentPageEntity,
  selectCurrentPageEntityActiveChildIndex,
  toggleRecordPageMenuOpen,

  navigateToRecordsList,
  exportRecords,
};
