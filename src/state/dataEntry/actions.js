import "react-native-get-random-values";

import {
  NodeFactory,
  RecordFactory,
  Records,
  RecordUpdater,
} from "@openforis/arena-core";

import { SurveySelectors } from "../survey/selectors";
import { DataEntrySelectors } from "./selectors";
import { RecordService } from "../../service/recordService";
import { screenKeys } from "../../navigation/screenKeys";
import { RecordPageNavigator } from "./recordPageNavigator";

const CURRENT_RECORD_SET = "CURRENT_RECORD_SET";
const PAGE_SELECTOR_MENU_OPEN_SET = "PAGE_SELECTOR_MENU_OPEN_SET";
const CURRENT_PAGE_ENTITY_SET = "CURRENT_PAGE_ENTITY_SET";

const createNewRecord =
  ({ navigation }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const recordEmpty = RecordFactory.createInstance({
      surveyUuid: survey.uuid,
      user: {},
    });
    let { record } = await RecordUpdater.createRootEntity({
      survey,
      record: recordEmpty,
    });

    record.surveyId = survey.id;

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

  const nodeCreated = Object.values(nodesCreated).find(
    (nodeCreated) => nodeCreated.nodeDefUuid === nodeDef.uuid
  );

  await RecordService.updateRecord({ survey, record: recordUpdated });

  dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated });
  dispatch(
    selectCurrentPageEntity({
      entityDefUuid: nodeDef.uuid,
      entityUuid: nodeCreated.uuid,
    })
  );
};

const deleteNodes = (nodeUuids) => async (dispatch, getState) => {
  const state = getState();
  const survey = SurveySelectors.selectCurrentSurvey(state);
  const record = DataEntrySelectors.selectRecord(state);

  const { record: recordUpdated } = await RecordUpdater.deleteNodes({
    survey,
    record,
    nodeUuids,
  });

  await RecordService.updateRecord({ survey, record: recordUpdated });

  dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated });
};

const deleteRecords = (recordUuids) => async (_dispatch, getState) => {
  const state = getState();
  const survey = SurveySelectors.selectCurrentSurvey(state);

  await RecordService.deleteRecords({ surveyId: survey.id, recordUuids });
};

const editRecord =
  ({ navigation, record }) =>
  (dispatch) => {
    dispatch({ type: CURRENT_RECORD_SET, record });
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
  ({ uuid, value }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);

    const node = Records.getNodeByUuid(uuid)(record);

    const nodeUpdated = { ...node, value };

    const { record: recordUpdated } = await RecordUpdater.updateNode({
      survey,
      record,
      node: nodeUpdated,
    });

    await RecordService.updateRecord({ survey, record: recordUpdated });

    dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated });
  };

const addNewAttribute =
  ({ nodeDef, parentNodeUuid, value }) =>
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
    const nodeUpdated = { ...nodeCreated, value };

    const { record: recordUpdated2 } = await RecordUpdater.updateNode({
      survey,
      record: recordUpdated,
      node: nodeUpdated,
    });

    await RecordService.updateRecord({ survey, record: recordUpdated2 });

    dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated2 });
  };

const selectCurrentPageEntity =
  ({ entityDefUuid, entityUuid = null }) =>
  (dispatch, getState) => {
    const state = getState();
    const currentPageEntity = DataEntrySelectors.selectCurrentPageEntity(state);
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);

    const nextPageEntity = RecordPageNavigator.determinePageEntity({
      survey,
      record,
      currentPageEntity,
      entityDefUuid,
      entityUuid,
    });

    if (!nextPageEntity) return;

    dispatch({
      type: CURRENT_PAGE_ENTITY_SET,
      entityDefUuid,
      parentEntityUuid: nextPageEntity.parentEntityUuid,
      entityUuid: nextPageEntity.entityUuid,
    });
  };

const toggleRecordPageMenuOpen = (dispatch, getState) => {
  const state = getState();
  const open = DataEntrySelectors.selectRecordPageSelectorMenuOpen(state);
  dispatch({ type: PAGE_SELECTOR_MENU_OPEN_SET, open: !open });
};

export const DataEntryActions = {
  CURRENT_RECORD_SET,
  CURRENT_PAGE_ENTITY_SET,
  PAGE_SELECTOR_MENU_OPEN_SET,

  createNewRecord,
  addNewEntity,
  addNewAttribute,
  deleteNodes,
  deleteRecords,
  fetchAndEditRecord,
  updateAttribute,
  selectCurrentPageEntity,
  toggleRecordPageMenuOpen,
};
