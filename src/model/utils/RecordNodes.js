import {
  NodeDefs,
  NodeValueFormatter,
  Nodes,
  Objects,
  RecordExpressionEvaluator,
  Records,
  Surveys,
} from "@openforis/arena-core";
import { SurveyDefs } from "./SurveyNodeDefs";

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

const getEntitySummaryValuesByNameFormatted = ({
  survey,
  record,
  entity,
  onlyKeys = true,
  lang,
}) => {
  const cycle = record.cycle;
  const entityDef = Surveys.getNodeDefByUuid({
    survey,
    uuid: entity.nodeDefUuid,
  });
  const summaryDefs = SurveyDefs.getEntitySummaryDefs({
    survey,
    entityDef,
    record,
    onlyKeys,
  });
  return summaryDefs.reduce((acc, summaryDef) => {
    const summaryNode = Records.getChild(entity, summaryDef.uuid)(record);
    let formattedValue = summaryNode
      ? NodeValueFormatter.format({
          survey,
          cycle,
          nodeDef: summaryDef,
          node: summaryNode,
          value: summaryNode.value,
          showLabel: true,
          lang,
        })
      : "";
    if (typeof formattedValue === "object") {
      formattedValue = JSON.stringify(formattedValue);
    }
    if (Objects.isEmpty(formattedValue)) {
      formattedValue = EMPTY_VALUE;
    }
    acc[NodeDefs.getName(summaryDef)] = formattedValue;

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
  getEntitySummaryValuesByNameFormatted,
  getApplicableChildrenEntityDefs,
  getSiblingNode,
  getCoordinateDistanceTarget,
};
