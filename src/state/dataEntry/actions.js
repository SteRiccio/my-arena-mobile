import "react-native-get-random-values";

import {
  NodeDefs,
  RecordFactory,
  Records,
  RecordUpdater,
  Surveys,
} from "@openforis/arena-core";

import { SurveySelectors } from "../survey/selectors";
import { DataEntrySelectors } from "./selectors";
import { RecordService } from "../../service/recordService";
import { screenKeys } from "../../navigation/screenKeys";

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

const updateCurrentRecordAttribute =
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

const selectCurrentPageEntity =
  ({ entityDefUuid, entityUuid = null }) =>
  (dispatch, getState) => {
    const state = getState();
    const {
      entityDef: prevEntityDef,
      parentEntityUuid: prevParentEntityUuid,
      entityUuid: prevEntityUuid,
    } = DataEntrySelectors.selectCurrentPageEntity(state);

    if (
      entityDefUuid === prevEntityDef?.uuid &&
      entityUuid === prevEntityUuid
    ) {
      return;
    }
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);
    const entityDef = Surveys.getNodeDefByUuid({ survey, uuid: entityDefUuid });
    const prevParentEntity = prevParentEntityUuid
      ? Records.getNodeByUuid(prevParentEntityUuid)(record)
      : null;

    let nextParentEntityUuid, nextEntityUuid;
    if (prevEntityDef.uuid === entityDefUuid) {
      nextParentEntityUuid = prevParentEntityUuid;
      nextEntityUuid = entityUuid;
    } else if (
      Surveys.isNodeDefAncestor({
        nodeDefAncestor: entityDef,
        nodeDefDescendant: prevEntityDef,
      })
    ) {
      const nextEntity = Records.getAncestor({
        record,
        ancestorDefUuid: entityDefUuid,
        node: prevParentEntity,
      });
      nextEntityUuid = nextEntity?.uuid;
      nextParentEntityUuid = nextEntity?.parentUuid;
    } else {
      const parentEntityDef = Surveys.getNodeDefParent({
        survey,
        nodeDef: entityDef,
      });

      const root = Records.getRoot(record);

      nextParentEntityUuid = NodeDefs.isRoot(parentEntityDef)
        ? root?.uuid
        : parentEntityDef.uuid === prevParentEntity?.nodeDefUuid
        ? prevParentEntityUuid
        : Records.getDescendant({
            record,
            node: prevParentEntity || root,
            nodeDefDescendant: parentEntityDef,
          })?.uuid;
      nextEntityUuid = entityUuid;
    }

    dispatch({
      type: CURRENT_PAGE_ENTITY_SET,
      entityDefUuid,
      parentEntityUuid: nextParentEntityUuid,
      entityUuid: nextEntityUuid,
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
  deleteNodes,
  fetchAndEditRecord,
  updateCurrentRecordAttribute,
  selectCurrentPageEntity,
  toggleRecordPageMenuOpen,
};
