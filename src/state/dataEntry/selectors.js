import { createSelector } from "reselect";
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

const selectRecord = (state) => state.dataEntry.currentRecord;

const selectRecordRootNodeUuid = createSelector(
  [selectRecord],
  (record) => Records.getRoot(record)?.uuid
);

const selectRecordCycle = createSelector(
  [selectRecord],
  (record) => record.cycle
);

const selectRecordSingleNodeUuid = createSelector(
  [
    selectRecord,
    (_, parentNodeUuid) => parentNodeUuid,
    (_state, _parentNodeUuid, nodeDefUuid) => nodeDefUuid,
  ],
  (record, parentNodeUuid, nodeDefUuid) => {
    if (parentNodeUuid) {
      const parentNode = Records.getNodeByUuid(parentNodeUuid)(record);
      const node = Records.getChild(parentNode, nodeDefUuid)(record);
      return node?.uuid;
    }
    const root = Records.getRoot(record);
    return root?.uuid;
  }
);

const selectRecordNodePointerValidation = createSelector(
  [
    selectRecord,
    (_state, nodeParentUuid) => nodeParentUuid,
    (_state, _nodeParentUuid, nodeDefUuid) => nodeDefUuid,
  ],
  (record, nodeParentUuid, nodeDefUuid) => {
    const nodeParent = Records.getNodeByUuid(nodeParentUuid)(record);
    const node = Records.getChild(nodeParent, nodeDefUuid)(record);
    if (!node) return undefined;

    const validation = RecordValidations.getValidationNode({
      nodeUuid: node.uuid,
    })(record.validation);
    return validation;
  }
);

const selectRecordNodePointerValidationChildrenCount = createSelector(
  [
    selectRecord,
    (_state, nodeParentUuid) => nodeParentUuid,
    (_state, _nodeParentUuid, nodeDefUuid) => nodeDefUuid,
  ],
  (record, nodeParentUuid, nodeDefUuid) => {
    const validationChildrenCount =
      RecordValidations.getValidationChildrenCount({
        nodeParentUuid,
        nodeDefChildUuid: nodeDefUuid,
      })(record.validation);
    return validationChildrenCount;
  }
);

const selectRecordNodePointerVisibility = createSelector(
  [
    SurveySelectors.selectCurrentSurvey,
    selectRecord,
    (_state, nodeParentUuid) => nodeParentUuid,
    (_state, _nodeParentUuid, nodeDefUuid) => nodeDefUuid,
  ],
  (survey, record, nodeParentUuid, nodeDefUuid) => {
    const parentNode = Records.getNodeByUuid(nodeParentUuid)(record);
    const applicable = Nodes.isChildApplicable(parentNode, nodeDefUuid);
    const nodeDefChild = Surveys.getNodeDefByUuid({
      survey,
      uuid: nodeDefUuid,
    });
    const cycle = record.cycle;
    const hiddenWhenNotRelevant =
      NodeDefs.isHiddenWhenNotRelevant(cycle)(nodeDefChild);
    return applicable || !hiddenWhenNotRelevant;
  }
);

const selectRecordAttributeInfo = createSelector(
  [selectRecord, (_state, nodeUuid) => nodeUuid],
  (record, nodeUuid) => {
    const attribute = Records.getNodeByUuid(nodeUuid)(record);
    const value = attribute?.value;
    const validation = RecordValidations.getValidationNode({ nodeUuid })(
      record.validation
    );
    const applicable = Records.isNodeApplicable({ record, node: attribute });
    return { applicable, value, validation };
  }
);

const selectVisibleChildDefs = createSelector(
  [
    SurveySelectors.selectCurrentSurvey,
    // selectCurrentRecord,
    (_state, nodeDef) => nodeDef,
  ],
  (survey, nodeDef) => {
    const childDefs = Surveys.getNodeDefChildren({
      survey,
      nodeDef,
      includeAnalysis: false,
    });
    return childDefs;
  }
);

export const DataEntrySelectors = {
  selectRecord,

  useRecordCycle: () => useSelector(selectRecordCycle),

  useRecordRootNodeUuid: () => useSelector(selectRecordRootNodeUuid),

  useRecordSingleNodeUuid: ({ parentNodeUuid, nodeDefUuid }) =>
    useSelector((state) =>
      selectRecordSingleNodeUuid(state, parentNodeUuid, nodeDefUuid)
    ),

  useRecordEntityVisibleChildDefs: ({ nodeDef }) =>
    useSelector((state) => selectVisibleChildDefs(state, nodeDef)),

  useRecordNodePointerValidation: ({ parentNodeUuid, nodeDefUuid }) =>
    useSelector(
      (state) =>
        selectRecordNodePointerValidation(state, parentNodeUuid, nodeDefUuid),
      Objects.isEqual
    ),

  useRecordNodePointerValidationChildrenCount: ({
    parentNodeUuid,
    nodeDefUuid,
  }) =>
    useSelector(
      (state) =>
        selectRecordNodePointerValidationChildrenCount(
          state,
          parentNodeUuid,
          nodeDefUuid
        ),
      Objects.isEqual
    ),

  useRecordNodePointerVisibility: ({ parentNodeUuid, nodeDefUuid }) =>
    useSelector((state) =>
      selectRecordNodePointerVisibility(state, parentNodeUuid, nodeDefUuid)
    ),

  useRecordAttributeInfo: ({ nodeUuid }) =>
    useSelector(
      (state) => selectRecordAttributeInfo(state, nodeUuid),
      Objects.isEqual
    ),
};
