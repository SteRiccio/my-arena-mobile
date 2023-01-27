import { createSelector } from "reselect";
import { useSelector } from "react-redux";

import {
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

const selectRecordAttributeInfo = createSelector(
  [selectRecord, (_state, nodeUuid) => nodeUuid],
  (record, nodeUuid) => {
    const attribute = Records.getNodeByUuid(nodeUuid)(record);
    const value = attribute?.value;
    const validation = RecordValidations.getValidationNode({ nodeUuid })(
      record.validation
    );
    return { value, validation };
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

  useRecordAttributeInfo: ({ nodeUuid }) =>
    useSelector(
      (state) => selectRecordAttributeInfo(state, nodeUuid),
      Objects.isEqual
    ),
};
