const { Surveys, NodeDefs } = require("@openforis/arena-core");

const getEntitySummaryDefs = ({
  survey,
  entityDef,
  record,
  onlyKeys = true,
  maxSummaryDefs = 3,
}) => {
  const keyDefs = Surveys.getNodeDefKeys({ survey, nodeDef: entityDef });

  const summaryDefs = [...keyDefs];

  if (!onlyKeys && summaryDefs.length < maxSummaryDefs) {
    const cycle = record.cycle;
    const entityDefChildrenNotKeys = Surveys.getNodeDefChildrenSorted({
      survey,
      nodeDef: entityDef,
      cycle,
      includeAnalysis: false,
    }).filter(
      (childDef) => !NodeDefs.isKey(childDef) && !NodeDefs.isMultiple(childDef)
    );
    if (entityDefChildrenNotKeys.length > 0) {
      summaryDefs.push(
        ...entityDefChildrenNotKeys.slice(
          0,
          maxSummaryDefs - summaryDefs.length
        )
      );
    }
  }
  return summaryDefs;
};

export const SurveyDefs = {
  getEntitySummaryDefs,
};
