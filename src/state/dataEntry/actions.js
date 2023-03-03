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
const CURRENT_PAGE_NODE_SET = "CURRENT_PAGE_NODE_SET";

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
  const { parentNode, nodeDef } =
    DataEntrySelectors.selectCurrentPageNode(state);

  const { record: recordUpdated, nodes: nodesCreated } =
    await RecordUpdater.createNodeAndDescendants({
      survey,
      record,
      parentNode: parentNode || Records.getRoot(record),
      nodeDef,
    });
  const nodeCreated = Object.values(nodesCreated).find(
    (nodeCreated) => nodeCreated.nodeDefUuid === nodeDef.uuid
  );

  dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated });
  dispatch(
    selectCurrentPageNode({
      nodeDefUuid: nodeDef.uuid,
      nodeUuid: nodeCreated.uuid,
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

const selectCurrentPageNode =
  ({ nodeDefUuid, nodeUuid = null }) =>
  (dispatch, getState) => {
    const state = getState();
    const { nodeDef: prevNodeDef, parentNode: prevParentNode } =
      DataEntrySelectors.selectCurrentPageNode(state);

    if (prevNodeDef.uuid === nodeDefUuid && !nodeUuid) {
      return;
    }
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);
    const nodeDef = Surveys.getNodeDefByUuid({ survey, uuid: nodeDefUuid });

    let nextParentNode, nextNode;
    if (prevNodeDef.uuid === nodeDefUuid) {
      nextParentNode = prevParentNode;
      nextNode = nodeUuid ? Records.getNodeByUuid(nodeUuid)(record) : null;
    } else if (
      Surveys.isNodeDefAncestor({
        nodeDefAncestor: nodeDef,
        nodeDefDescendant: prevNodeDef,
      })
    ) {
      nextNode = Records.getAncestor({
        record,
        ancestorDefUuid: nodeDefUuid,
        node: prevParentNode,
      });
      nextParentNode = Records.getParent(nextNode)(record);
    } else {
      const parentNodeDef = Surveys.getNodeDefParent({ survey, nodeDef });

      const root = Records.getRoot(record);

      nextParentNode =
        parentNodeDef.uuid === prevParentNode?.nodeDefUuid
          ? prevParentNode
          : NodeDefs.isRoot(parentNodeDef)
          ? root
          : Records.getDescendant({
              record,
              node: prevParentNode || root,
              nodeDefDescendant: parentNodeDef,
            });
      nextNode = nodeUuid ? Records.getNodeByUuid(nodeUuid)(record) : null;
    }

    dispatch({
      type: CURRENT_PAGE_NODE_SET,
      nodeDefUuid,
      parentNodeUuid: nextParentNode?.uuid,
      nodeUuid: nextNode?.uuid,
    });
  };

const toggleRecordPageMenuOpen = (dispatch, getState) => {
  const state = getState();
  const open = DataEntrySelectors.selectRecordPageSelectorMenuOpen(state);
  dispatch({ type: PAGE_SELECTOR_MENU_OPEN_SET, open: !open });
};

export const DataEntryActions = {
  CURRENT_RECORD_SET,
  CURRENT_PAGE_NODE_SET,
  PAGE_SELECTOR_MENU_OPEN_SET,

  createNewRecord,
  addNewEntity,
  fetchAndEditRecord,
  updateCurrentRecordAttribute,
  selectCurrentPageNode,
  toggleRecordPageMenuOpen,
};
