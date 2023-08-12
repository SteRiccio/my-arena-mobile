const { Surveys, NodeDefs } = require("@openforis/arena-core");

const getEntitySummaryDefs = ({
  survey,
  entityDef,
  record,
  onlyKeys = true,
}) => {
  const keyDefs = Surveys.getNodeDefKeys({ survey, nodeDef: entityDef });

  const summaryDefs = [...keyDefs];

  if (!onlyKeys && summaryDefs.length <= 1) {
    const cycle = record.cycle;
    const entityDefChildrenNotKeys = Surveys.getNodeDefChildrenSorted({
      survey,
      nodeDef: entityDef,
      cycle,
      includeAnalysis: false,
    }).filter((childDef) => !NodeDefs.isKey(childDef));
    if (entityDefChildrenNotKeys.length > 0) {
      summaryDefs.push(entityDefChildrenNotKeys[0]);
    }
  }
  return summaryDefs;
};

export const SurveyDefs = {
  getEntitySummaryDefs,
};
