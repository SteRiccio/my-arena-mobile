import { useSelector } from "react-redux";

import {
  NodeDefs,
  NodeDefType,
  Nodes,
  NodeValues,
  Objects,
  Records,
  RecordValidations,
  Surveys,
} from "@openforis/arena-core";

import { SurveySelectors } from "../survey/selectors";

const getDataEntryState = (state) => state.dataEntry;

const selectRecord = (state) => getDataEntryState(state).record;

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

const _cleanupAttributeValue = ({ value, attributeDef }) => {
  if (!value) return value;

  if (NodeDefs.getType(attributeDef) === NodeDefType.coordinate) {
    const additionalFields =
      NodeDefs.getCoordinateAdditionalFields(attributeDef);
    const mandatoryFields = ["x", "y", "srs"];
    const fieldsToRemove = Object.keys(value).filter(
      (field) =>
        !mandatoryFields.includes(field) && !additionalFields.includes(field)
    );
    fieldsToRemove.forEach((field) => {
      delete value[field];
    });
  }
  return value;
};

const selectRecordAttributeInfo =
  (state) =>
  ({ nodeUuid }) => {
    const record = selectRecord(state);
    const attribute = Records.getNodeByUuid(nodeUuid)(record);
    let value = attribute?.value;
    if (value) {
      const survey = SurveySelectors.selectCurrentSurvey(state);
      const attributeDef = attribute
        ? Surveys.getNodeDefByUuid({ survey, uuid: attribute.nodeDefUuid })
        : null;
      value = _cleanupAttributeValue({ value, attributeDef });
    }
    const validation = RecordValidations.getValidationNode({ nodeUuid })(
      record.validation
    );
    const applicable = Records.isNodeApplicable({ record, node: attribute });
    return { applicable, value, validation };
  };

const selectRecordChildNodes =
  (state) =>
  ({ parentEntityUuid, nodeDef }) => {
    const record = selectRecord(state);
    const parentEntity = Records.getNodeByUuid(parentEntityUuid)(record);
    const nodes = Records.getChildren(parentEntity, nodeDef.uuid)(record);
    return { nodes };
  };

const selectChildDefs =
  (state) =>
  ({ nodeDef }) => {
    const cycle = selectRecordCycle(state);
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const childDefs = Surveys.getNodeDefChildrenSorted({
      survey,
      nodeDef,
      cycle,
      includeAnalysis: false,
    }) // only child defs not hidden in mobile and in same page
      .filter((childDef) => {
        const layoutProps = NodeDefs.getLayoutProps(cycle)(childDef);
        return (
          !childDef.props.hidden &&
          !layoutProps.hiddenInMobile &&
          !layoutProps.pageUuid
        );
      });
    return childDefs;
  };

const selectRecordCodeParentItemUuid =
  (state) =>
  ({ nodeDef, parentNodeUuid }) => {
    const parentCodeDefUuid = NodeDefs.getParentCodeDefUuid(nodeDef);
    if (!parentCodeDefUuid) return null;

    const record = selectRecord(state);
    const parentNode = Records.getNodeByUuid(parentNodeUuid)(record);
    const parentCodeAttribute = Records.getParentCodeAttribute({
      parentNode,
      nodeDef,
    })(record);
    return parentCodeAttribute
      ? NodeValues.getItemUuid(parentCodeAttribute)
      : null;
  };

const selectCurrentPageEntity = (state) => {
  const survey = SurveySelectors.selectCurrentSurvey(state);
  const record = selectRecord(state);

  const { parentEntityUuid, entityDefUuid, entityUuid } =
    getDataEntryState(state).recordCurrentPageEntity || {};

  if (!parentEntityUuid) {
    return {
      parentEntityUuid: null,
      entityDef: Surveys.getNodeDefRoot({ survey }),
      entityUuid: Records.getRoot(record).uuid,
    };
  }
  const entityDef = Surveys.getNodeDefByUuid({ survey, uuid: entityDefUuid });

  return { parentEntityUuid, entityDef, entityUuid };
};

const selectCurrentPageEntityRelevantChildDefs = (state) => {
  const { parentEntityUuid, entityDef, entityUuid } =
    selectCurrentPageEntity(state);
  const childDefs = selectChildDefs(state)({ nodeDef: entityDef });
  const record = selectRecord(state);
  const parentEntity = Records.getNodeByUuid(entityUuid || parentEntityUuid)(
    record
  );
  return childDefs.filter((childDef) =>
    Nodes.isChildApplicable(parentEntity, childDef.uuid)
  );
};

const selectCurrentPageEntityActiveChildDefIndex = (state) =>
  getDataEntryState(state).activeChildDefIndex;

// record page
const selectRecordPageSelectorMenuOpen = (state) =>
  getDataEntryState(state).recordPageSelectorMenuOpen;

export const DataEntrySelectors = {
  selectRecord,
  selectCurrentPageEntity,

  useRecord: () => useSelector(selectRecord),

  useIsEditingRecord: () => useSelector(selectIsEditingRecord),

  useRecordCycle: () => useSelector(selectRecordCycle),

  useRecordRootNodeUuid: () => useSelector(selectRecordRootNodeUuid),

  useRecordSingleNodeUuid: ({ parentNodeUuid, nodeDefUuid }) =>
    useSelector((state) =>
      selectRecordSingleNodeUuid(state)({ parentNodeUuid, nodeDefUuid })
    ),

  useRecordEntityChildDefs: ({ nodeDef }) =>
    useSelector(
      (state) => selectChildDefs(state)({ nodeDef }),
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

  useRecordChildNodes: ({ parentEntityUuid, nodeDef }) =>
    useSelector(
      (state) =>
        selectRecordChildNodes(state)({
          parentEntityUuid,
          nodeDef,
        }),
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

  useRecordCodeParentItemUuid: ({ parentNodeUuid, nodeDef }) =>
    useSelector((state) =>
      selectRecordCodeParentItemUuid(state)({ parentNodeUuid, nodeDef })
    ),

  useCurrentPageEntity: () =>
    useSelector((state) => selectCurrentPageEntity(state), Objects.isEqual),

  useCurrentPageEntityRelevantChildDefs: () =>
    useSelector(
      (state) => selectCurrentPageEntityRelevantChildDefs(state),
      Objects.isEqual
    ),

  useCurrentPageEntityActiveChildIndex: () =>
    useSelector((state) => selectCurrentPageEntityActiveChildDefIndex(state)),

  // page selector
  selectRecordPageSelectorMenuOpen,
  useIsRecordPageSelectorMenuOpen: () =>
    useSelector((state) => selectRecordPageSelectorMenuOpen(state)),
};
