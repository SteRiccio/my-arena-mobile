import {
  NodeDefs,
  NodeValueFormatter,
  Nodes,
  RecordExpressionEvaluator,
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

const getApplicableChildrenEntityDefs = ({ survey, nodeDef, parentEntity }) =>
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

const getCoordinateDistanceTarget = ({ survey, nodeDef, record, node }) => {
  const possibleExpressions = {
    simpleIdentifier: "\\w+",
    categoryItemProp: `categoryItemProp\\s*\\(.*\\)\\s*`,
    parentFunction: `parent\\s*\\(.*\\)\\s*`,
  };
  const validations = NodeDefs.getValidations(nodeDef);
  const distanceValidation = validations?.expressions?.find((expression) =>
    /\s*distance\s*(.*)\s*/.test(expression.expression)
  );

  if (!distanceValidation) {
    return null;
  }
  const thisOrAttrName = `(?:this|${NodeDefs.getName(nodeDef)})`;

  const distanceFunctionRegExp = (firstArgument, secondArgument) =>
    `\\s*distance\\s*\\(\\s*(${firstArgument})\\s*,\\s*(${secondArgument})\\s*\\)`;

  let distanceTargetExpression = null;
  Object.values(possibleExpressions).some((possibleExpression) => {
    const expression = distanceValidation.expression;
    // this or attribute name as 1st argument
    let match = expression.match(
      distanceFunctionRegExp(thisOrAttrName, possibleExpression)
    );
    if (match) {
      distanceTargetExpression = match[2];
      return true;
    }
    // this or attribute name as 2nd argument
    match = expression.match(
      distanceFunctionRegExp(possibleExpression, thisOrAttrName)
    );
    if (match) {
      distanceTargetExpression = match[1];
      return true;
    }
    return false;
  });
  if (distanceTargetExpression) {
    const distanceTarget = new RecordExpressionEvaluator().evalExpression({
      survey,
      record,
      node,
      query: distanceTargetExpression,
    });
    return distanceTarget;
  }
  return null;
};

export const RecordNodes = {
  getNodeName,
  getEntityKeyValuesByNameFormatted,
  getApplicableChildrenEntityDefs,
  getSiblingNode,
  getCoordinateDistanceTarget,
};
