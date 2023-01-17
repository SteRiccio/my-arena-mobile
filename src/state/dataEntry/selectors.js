import { createSelector } from "reselect";
import { useSelector } from "react-redux";

import { Records, Surveys } from "@openforis/arena-core";

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

const selectRecordNodePointerInfo = createSelector(
  [
    selectRecord,
    (_, nodeParentUuid) => nodeParentUuid,
    (_state, _nodeParentUuid, nodeDefUuid) => nodeDefUuid,
  ],
  (record, nodeParentUuid, nodeDefUuid) => {
    const parentNode = Records.getNodeByUuid(nodeParentUuid)(record);
    const node = Records.getChild(parentNode, nodeDefUuid)(record);
    const validation = record.validation?.fields?.[node?.uuid];

    const validationChildrenCountKey = Records.getValidationChildrenCountKey({
      nodeParentUuid,
      nodeDefChildUuid: nodeDefUuid,
    });
    const validationChildrenCount =
      record?.validation?.[validationChildrenCountKey];

    return { node, validation, validationChildrenCount };
  }
);

const selectRecordNodeInfo = createSelector(
  [selectRecord, (_, nodeUuid) => nodeUuid],
  (record, nodeUuid) => {
    const node = Records.getNodeByUuid(nodeUuid)(record);
    const validation = record.validation[nodeUuid];

    return {
      node,
      validation,
    };
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
  selectRecordRootNodeUuid,
  selectRecordSingleNodeUuid,
  selectRecordNodeInfo,

  useRecordRootNodeUuid: () => useSelector(selectRecordRootNodeUuid),
  useRecordNodePointerInfo: ({ parentNodeUuid, nodeDefUuid }) =>
    useSelector((state) =>
      selectRecordNodePointerInfo(state, parentNodeUuid, nodeDefUuid)
    ),
  useRecordSingleNodeUuid: ({ parentNodeUuid, nodeDefUuid }) =>
    useSelector((state) =>
      selectRecordSingleNodeUuid(state, parentNodeUuid, nodeDefUuid)
    ),
  useRecordEntityVisibleChildDefs: ({ nodeDef }) =>
    useSelector((state) => selectVisibleChildDefs(state, nodeDef)),
  useRecordNodeInfo: ({ nodeUuid }) =>
    useSelector((state) => selectRecordNodeInfo(state, nodeUuid)),
};
