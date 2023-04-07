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
  const { parentEntity: currentParentNode, entityDef: nodeDef } =
    DataEntrySelectors.selectCurrentPageEntity(state);

  const parentNode = currentParentNode || Records.getRoot(record);

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

  await RecordService.updateRecord({
    survey,
    record: recordUpdated,
  });

  dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated });
  dispatch(
    selectCurrentPageEntity({
      entityDefUuid: nodeDef.uuid,
      entityUuid: nodeCreated.uuid,
    })
  );
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

    await RecordService.updateRecord({ survey, record });

    dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated });
  };

const selectCurrentPageEntity =
  ({ entityDefUuid, entityUuid = null }) =>
  (dispatch, getState) => {
    const state = getState();
    const {
      entityDef: prevEntityDef,
      parentEntity: prevParentEntity,
      entity: prevEntity,
    } = DataEntrySelectors.selectCurrentPageEntity(state);

    if (
      entityDefUuid === prevEntityDef?.uuid &&
      entityUuid === prevEntity?.uuid
    ) {
      return;
    }
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);
    const entityDef = Surveys.getNodeDefByUuid({ survey, uuid: entityDefUuid });

    let nextParentEntity, nextEntity;
    if (prevEntityDef.uuid === entityDefUuid) {
      nextParentEntity = prevParentEntity;
      nextEntity = entityUuid
        ? Records.getNodeByUuid(entityUuid)(record)
        : null;
    } else if (
      Surveys.isNodeDefAncestor({
        nodeDefAncestor: entityDef,
        nodeDefDescendant: prevEntityDef,
      })
    ) {
      nextEntity = Records.getAncestor({
        record,
        ancestorDefUuid: entityDefUuid,
        node: prevParentEntity,
      });
      nextParentEntity = Records.getParent(nextEntity)(record);
    } else {
      const parentEntityDef = Surveys.getNodeDefParent({
        survey,
        nodeDef: entityDef,
      });

      const root = Records.getRoot(record);

      nextParentEntity =
        parentEntityDef.uuid === prevParentEntity?.nodeDefUuid
          ? prevParentEntity
          : NodeDefs.isRoot(parentEntityDef)
          ? root
          : Records.getDescendant({
              record,
              node: prevParentEntity || root,
              nodeDefDescendant: parentEntityDef,
            });
      nextEntity = entityUuid
        ? Records.getNodeByUuid(entityUuid)(record)
        : null;
    }

    dispatch({
      type: CURRENT_PAGE_ENTITY_SET,
      entityDefUuid,
      parentEntityUuid: nextParentEntity?.uuid,
      entityUuid: nextEntity?.uuid,
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
  fetchAndEditRecord,
  updateCurrentRecordAttribute,
  selectCurrentPageEntity,
  toggleRecordPageMenuOpen,
};
