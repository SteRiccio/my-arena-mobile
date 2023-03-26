import { useSelector } from "react-redux";

import {
  NodeDefs,
  Nodes,
  Objects,
  Records,
  RecordValidations,
  Surveys,
} from "@openforis/arena-core";

import { SurveySelectors } from "../survey/selectors";

const getDataEntryState = (state) => state.dataEntry;

const selectRecord = (state) => getDataEntryState(state).currentRecord;

const selectIsEditingRecord = (state) => !!selectRecord(state);

const selectRecordRootNodeUuid = (state) => {
  const record = selectRecord(state);
  return Records.getRoot(record)?.uuid;
};

const selectRecordCycle = (state) => {
  const record = selectRecord(state);
  return record.cycle;
};

const selectRecordSingleNodeUuid =
  (state) =>
  ({ parentNodeUuid, nodeDefUuid }) => {
    const record = selectRecord(state);
    const parentNode = Records.getNodeByUuid(parentNodeUuid)(record);
    const node = Records.getChild(parentNode, nodeDefUuid)(record);
    return node?.uuid;
  };

const selectRecordEntitiesUuidsAndKeyValues =
  (state) =>
  ({ parentNodeUuid, nodeDefUuid }) => {
    const record = selectRecord(state);
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const parentNode = Records.getNodeByUuid(parentNodeUuid)(record);
    const entities = Records.getChildren(parentNode, nodeDefUuid)(record);
    return entities.map((entity) => ({
      uuid: entity.uuid,
      keyValues: Records.getEntityKeyValues({ survey, record, entity }),
    }));
  };

const selectRecordNodePointerValidation =
  (state) =>
  ({ parentNodeUuid, nodeDefUuid }) => {
    const record = selectRecord(state);
    const nodeParent = Records.getNodeByUuid(parentNodeUuid)(record);
    const nodes = Records.getChildren(nodeParent, nodeDefUuid)(record);
    if (nodes.length === 0) return undefined;

    const node = nodes[0];
    const validation = RecordValidations.getValidationNode({
      nodeUuid: node.uuid,
    })(record.validation);
    return validation;
  };

const selectRecordNodePointerValidationChildrenCount =
  (state) =>
  ({ parentNodeUuid, nodeDefUuid }) => {
    const record = selectRecord(state);
    const validationChildrenCount =
      RecordValidations.getValidationChildrenCount({
        nodeParentUuid: parentNodeUuid,
        nodeDefChildUuid: nodeDefUuid,
      })(record.validation);
    return validationChildrenCount;
  };

const selectRecordNodePointerVisibility =
  (state) =>
  ({ parentNodeUuid, nodeDefUuid }) => {
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = selectRecord(state);

    const parentNode = Records.getNodeByUuid(parentNodeUuid)(record);
    const applicable = Nodes.isChildApplicable(parentNode, nodeDefUuid);
    const nodeDefChild = Surveys.getNodeDefByUuid({
      survey,
      uuid: nodeDefUuid,
    });
    const cycle = record.cycle;
    const hiddenWhenNotRelevant =
      NodeDefs.isHiddenWhenNotRelevant(cycle)(nodeDefChild);
    return applicable || !hiddenWhenNotRelevant;
  };

const selectRecordAttributeInfo =
  (state) =>
  ({ nodeUuid }) => {
    const record = selectRecord(state);
    const attribute = Records.getNodeByUuid(nodeUuid)(record);
    const value = attribute?.value;
    const validation = RecordValidations.getValidationNode({ nodeUuid })(
      record.validation
    );
    const applicable = Records.isNodeApplicable({ record, node: attribute });
    return { applicable, value, validation };
  };

const selectVisibleChildDefs =
  (state) =>
  ({ nodeDef }) => {
    const cycle = selectRecordCycle(state);
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const childDefs = Surveys.getNodeDefChildren({
      survey,
      nodeDef,
      includeAnalysis: false,
    }) // only child defs in same page
      .filter((childDef) => !NodeDefs.getLayoutProps(cycle)(childDef).pageUuid);
    return childDefs;
  };

const selectCurrentPageNode = (state) => {
  const survey = SurveySelectors.selectCurrentSurvey(state);
  const record = selectRecord(state);
  const { parentNodeUuid, nodeDefUuid, nodeUuid } =
    getDataEntryState(state).recordCurrentPageNode || {};

  if (!parentNodeUuid) {
    return {
      parentNode: null,
      nodeDef: Surveys.getNodeDefRoot({ survey }),
      node: Records.getRoot(record),
    };
  }
  const nodeDef = Surveys.getNodeDefByUuid({ survey, uuid: nodeDefUuid });
  const parentNode = Records.getNodeByUuid(parentNodeUuid)(record);
  const node = nodeUuid ? Records.getNodeByUuid(nodeUuid)(record) : null;

  return { parentNode, nodeDef, node };
};

// record page
const selectRecordPageSelectorMenuOpen = (state) =>
  getDataEntryState(state).recordPageSelectorMenuOpen;

export const DataEntrySelectors = {
  selectRecord,
  selectCurrentPageNode,

  useRecord: () => useSelector(selectRecord),

  useIsEditingRecord: () => useSelector(selectIsEditingRecord),

  useRecordCycle: () => useSelector(selectRecordCycle),

  useRecordRootNodeUuid: () => useSelector(selectRecordRootNodeUuid),

  useRecordSingleNodeUuid: ({ parentNodeUuid, nodeDefUuid }) =>
    useSelector((state) =>
      selectRecordSingleNodeUuid(state)({ parentNodeUuid, nodeDefUuid })
    ),

  useRecordEntityVisibleChildDefs: ({ nodeDef }) =>
    useSelector(
      (state) => selectVisibleChildDefs(state)({ nodeDef }),
      Objects.isEqual
    ),

  useRecordNodePointerValidation: ({ parentNodeUuid, nodeDefUuid }) =>
    useSelector(
      (state) =>
        selectRecordNodePointerValidation(state)({
          parentNodeUuid,
          nodeDefUuid,
        }),
      Objects.isEqual
    ),

  useRecordNodePointerValidationChildrenCount: ({
    parentNodeUuid,
    nodeDefUuid,
  }) =>
    useSelector(
      (state) =>
        selectRecordNodePointerValidationChildrenCount(state)({
          parentNodeUuid,
          nodeDefUuid,
        }),
      Objects.isEqual
    ),

  useRecordNodePointerVisibility: ({ parentNodeUuid, nodeDefUuid }) =>
    useSelector((state) =>
      selectRecordNodePointerVisibility(state)({ parentNodeUuid, nodeDefUuid })
    ),

  useRecordAttributeInfo: ({ nodeUuid }) =>
    useSelector(
      (state) => selectRecordAttributeInfo(state)({ nodeUuid }),
      Objects.isEqual
    ),

  useRecordEntitiesUuidsAndKeyValues: ({ parentNodeUuid, nodeDefUuid }) =>
    useSelector(
      (state) =>
        selectRecordEntitiesUuidsAndKeyValues(state)({
          parentNodeUuid,
          nodeDefUuid,
        }),
      Objects.isEqual
    ),

  useCurrentPageNode: () =>
    useSelector((state) => selectCurrentPageNode(state), Objects.isEqual),

  // page selector
  selectRecordPageSelectorMenuOpen,
  useIsRecordPageSelectorMenuOpen: () =>
    useSelector((state) => selectRecordPageSelectorMenuOpen(state)),
};
