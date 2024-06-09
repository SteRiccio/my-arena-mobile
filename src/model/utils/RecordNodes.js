import {
  NodeDefs,
  NodeValueFormatter,
  Nodes,
  Objects,
  RecordExpressionEvaluator,
  Records,
  Surveys,
} from "@openforis/arena-core";
import { SurveyDefs } from "./SurveyDefs";

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

const getRootEntityKeysFormatted = ({ survey, record, lang }) => {
  const { cycle } = record;
  const keyDefs = SurveyDefs.getRootKeyDefs({ survey, cycle });
  const rootEntity = Records.getRoot(record);
  return keyDefs.map((keyDef) => {
    const keyNode = Records.getChild(rootEntity, keyDef.uuid)(record);
    return keyNode
      ? NodeValueFormatter.format({
          survey,
          cycle,
          nodeDef: keyDef,
          node: keyNode,
          value: keyNode.value,
          showLabel: true,
          lang,
        })
      : "";
  });
};

const getEntitySummaryValuesByNameFormatted = ({
  survey,
  record,
  entity,
  onlyKeys = true,
  lang,
  summaryDefs: summaryDefsParam = null,
}) => {
  const cycle = record.cycle;
  const entityDef = Surveys.getNodeDefByUuid({
    survey,
    uuid: entity.nodeDefUuid,
  });
  const summaryDefs =
    summaryDefsParam ??
    SurveyDefs.getEntitySummaryDefs({
      survey,
      record,
      entityDef,
      onlyKeys,
    });
  return summaryDefs.reduce((acc, summaryDef) => {
    let formattedValue = "";
    try {
      const summaryNode = Records.getChild(entity, summaryDef.uuid)(record);
      formattedValue = summaryNode
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
    } catch (error) {
      //ignore it
    }
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

const getApplicableChildrenEntityDefs = ({
  survey,
  nodeDef,
  parentEntity,
  cycle,
}) =>
  SurveyDefs.getChildrenDefs({ survey, nodeDef, cycle }).filter(
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
  getRootEntityKeysFormatted,
  getEntitySummaryValuesByNameFormatted,
  getApplicableChildrenEntityDefs,
  getSiblingNode,
  getCoordinateDistanceTarget,
};
