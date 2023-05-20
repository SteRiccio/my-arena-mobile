import {
  NodeDefs,
  NodeValueFormatter,
  Nodes,
  Records,
  Surveys,
} from "@openforis/arena-core";

const EMPTY_VALUE = "---EMPTY---";

const getNodeName = ({ survey, record, nodeUuid }) => {
  const node = Records.getNodeByUuid(nodeUuid)(record);
  if (node) {
    const nodeDef = Surveys.getNodeDefByUuid({
      survey,
      uuid: node.nodeDefUuid,
    });
    return NodeDefs.getName(nodeDef);
  }
  return null;
};

const getEntityKeyValuesByNameFormatted = ({ survey, record, entity }) => {
  const entityDef = Surveys.getNodeDefByUuid({
    survey,
    uuid: entity.nodeDefUuid,
  });
  const keyDefs = Surveys.getNodeDefKeys({ survey, nodeDef: entityDef });

  const keyNodes = Records.getEntityKeyNodes({
    survey,
    record,
    entity,
  });
  return keyDefs.reduce((acc, keyDef, index) => {
    const keyNode = keyNodes[index];
    acc[NodeDefs.getName(keyDef)] =
      NodeValueFormatter.format({
        survey,
        nodeDef: keyDef,
        value: keyNode?.value,
      }) || EMPTY_VALUE;
    return acc;
  }, {});
};

const getApplicableChildrenDefs = ({ survey, nodeDef, parentEntity }) =>
  Surveys.getNodeDefChildren({
    survey,
    nodeDef,
    includeAnalysis: false,
  }).filter(
    (childDef) =>
      NodeDefs.isEntity(childDef) &&
      Nodes.isChildApplicable(parentEntity, childDef.uuid)
  );

const getSiblingNode = ({ record, parentEntity, node, offset }) => {
  const siblingNodes = Records.getChildren(
    parentEntity,
    node.nodeDefUuid
  )(record);
  const nodeIndex = siblingNodes.indexOf(node);
  const siblingIndex = nodeIndex + offset;
  const siblingNode = siblingNodes[siblingIndex];
  return { siblingNode, siblingIndex };
};

export const RecordNodes = {
  getNodeName,
  getEntityKeyValuesByNameFormatted,
  getApplicableChildrenDefs,
  getSiblingNode,
};
