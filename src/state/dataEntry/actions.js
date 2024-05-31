import { Keyboard } from "react-native";

import {
  NodeDefs,
  NodeDefType,
  RecordFactory,
  Records,
  RecordUpdater,
  Surveys,
} from "@openforis/arena-core";

import { RecordOrigin, RecordLoadStatus, SurveyDefs } from "model";
import { RecordService } from "service/recordService";
import { RecordFileService } from "service/recordFileService";

import { screenKeys } from "screens/screenKeys";

import { SystemUtils } from "utils";

import { ConfirmActions } from "../confirm";
import { DeviceInfoActions } from "../deviceInfo";
import { SurveySelectors } from "../survey";

import { RemoteConnectionSelectors } from "../remoteConnection";
import { DataEntryActionTypes } from "./actionTypes";
import { DataEntrySelectors } from "./selectors";
import { exportRecords } from "./dataExportActions";
import { DataEntryActionsRecordPreviousCycle } from "./actionsRecordPreviousCycle";
import { importRecordsFromServer } from "./actionsRecordsImport";

const {
  DATA_ENTRY_RESET,
  PAGE_ENTITY_ACTIVE_CHILD_INDEX_SET,
  PAGE_ENTITY_SET,
  PAGE_SELECTOR_MENU_OPEN_SET,
  RECORD_SET,
} = DataEntryActionTypes;

const {
  fetchRecordFromPreviousCycle,
  linkToRecordInPreviousCycle,
  unlinkFromRecordInPreviousCycle,
  updatePreviousCyclePageEntity,
} = DataEntryActionsRecordPreviousCycle;

const removeNodesFlags = (nodes) => {
  Object.values(nodes).forEach((node) => {
    delete node["created"];
    delete node["deleted"];
    delete node["updated"];
  });
};

const createNewRecord =
  ({ navigation }) =>
  async (dispatch, getState) => {
    const state = getState();
    const user = RemoteConnectionSelectors.selectLoggedUser(state);
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const cycle = Surveys.getDefaultCycleKey(survey);
    // const cycle = SurveySelectors.selectCurrentSurveyCycle(state);
    const appInfo = SystemUtils.getRecordAppInfo();
    const recordEmpty = RecordFactory.createInstance({
      surveyUuid: survey.uuid,
      cycle,
      user: user ?? {},
      appInfo,
    });

    let { record, nodes } = await RecordUpdater.createRootEntity({
      survey,
      record: recordEmpty,
    });

    record.surveyId = survey.id;
    removeNodesFlags(nodes);

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

  removeNodesFlags(nodesCreated);

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

  removeNodesFlags(nodes);

  await RecordService.updateRecord({ survey, record: recordUpdated });

  dispatch({ type: RECORD_SET, record: recordUpdated });
};

const deleteRecords = (recordUuids) => async (dispatch, getState) => {
  const state = getState();
  const survey = SurveySelectors.selectCurrentSurvey(state);

  await RecordService.deleteRecords({ surveyId: survey.id, recordUuids });

  dispatch(DeviceInfoActions.updateFreeDiskStorage());
};

const editRecord =
  ({ navigation, record }) =>
  (dispatch) => {
    dispatch({ type: RECORD_SET, record });
    navigation.navigate(screenKeys.recordEditor);
  };

const _fetchAndEditRecordInternal = async ({
  dispatch,
  navigation,
  survey,
  recordId,
}) => {
  const record = await RecordService.fetchRecord({ survey, recordId });
  await dispatch(editRecord({ navigation, record }));
};

const fetchAndEditRecord =
  ({ navigation, recordSummary }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const {
      id: recordId,
      uuid: recordUuid,
      origin,
      loadStatus,
    } = recordSummary;
    if (
      origin === RecordOrigin.remote &&
      loadStatus !== RecordLoadStatus.complete
    ) {
      dispatch(
        ConfirmActions.show({
          confirmButtonTextKey: "dataEntry:records.importRecord",
          messageKey: "dataEntry:records.confirmImportRecordFromServer",
          onConfirm: () => {
            dispatch(
              importRecordsFromServer({
                recordUuids: [recordUuid],
                onImportComplete: async () => {
                  await _fetchAndEditRecordInternal({
                    dispatch,
                    navigation,
                    survey,
                    recordId,
                  });
                },
              })
            );
          },
        })
      );
    } else {
      await _fetchAndEditRecordInternal({
        dispatch,
        navigation,
        survey,
        recordId,
      });
    }
  };

const updateAttribute =
  ({ uuid, value, fileUri = null }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);
    const lang = SurveySelectors.selectCurrentSurveyPreferredLang(state);

    const node = Records.getNodeByUuid(uuid)(record);
    const nodeDef = Surveys.getNodeDefByUuid({
      survey,
      uuid: node.nodeDefUuid,
    });

    let { record: recordUpdated, nodes: nodesUpdated } =
      await RecordUpdater.updateAttributeValue({
        survey,
        record,
        attributeUuid: uuid,
        value,
      });

    removeNodesFlags(nodesUpdated);

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
      dispatch(DeviceInfoActions.updateFreeDiskStorage());
    }
    recordUpdated = await RecordService.updateRecord({
      survey,
      record: recordUpdated,
    });

    await dispatch({ type: RECORD_SET, record: recordUpdated });

    const isLinkedToPreviousCycleRecord =
      DataEntrySelectors.selectIsLinkedToPreviousCycleRecord(state);

    if (isLinkedToPreviousCycleRecord && NodeDefs.isKey(nodeDef)) {
      // updating key attribute; check if record has previous cycle record;
      const { cycle } = record;
      if (cycle > "0") {
        const rootKeys = SurveyDefs.getRootKeyDefs({ survey, cycle });
        const nodeDefIsRootKey = rootKeys.includes(nodeDef);
        if (nodeDefIsRootKey) {
          await fetchRecordFromPreviousCycle({
            dispatch,
            survey,
            record: recordUpdated,
            lang,
          });
        } else {
          dispatch(updatePreviousCyclePageEntity);
        }
      }
    }
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
      entityDefUuid === prevEntityDef.uuid &&
      entityUuid === prevEntityUuid &&
      NodeDefs.isMultiple(prevEntityDef)
        ? null // set pointer to list of entities
        : entityUuid;

    if (!!nextEntityUuid && nextEntityUuid === prevEntityUuid) {
      // same entity selected (e.g. single entity from breadcrumb): do nothing
      return;
    }

    const payload = {
      parentEntityUuid,
      entityDefUuid,
      entityUuid: nextEntityUuid,
    };

    dispatch({ type: PAGE_ENTITY_SET, payload });

    if (DataEntrySelectors.selectIsLinkedToPreviousCycleRecord(state)) {
      dispatch(updatePreviousCyclePageEntity);
    }
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

  linkToRecordInPreviousCycle,
  unlinkFromRecordInPreviousCycle,

  importRecordsFromServer,
};
