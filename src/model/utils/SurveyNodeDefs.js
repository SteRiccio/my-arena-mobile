import {
  Surveys,
  NodeDefs,
  NodeDefType,
  Categories,
} from "@openforis/arena-core";

const samplingPointDataCategoryName = "sampling_point_data";

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

const hasSamplingPointDataLocation = (survey) => {
  const samplingPointDataCategory = Surveys.getCategoryByName({
    survey,
    categoryName: samplingPointDataCategoryName,
  });
  return (
    samplingPointDataCategory &&
    !!Categories.getExtraPropDefByName("location")(samplingPointDataCategory)
  );
};

const isCodeAttributeFromSamplingPointData = ({ survey, nodeDef }) => {
  if (nodeDef.type !== NodeDefType.code) return false;

  const category = Surveys.getCategoryByUuid({
    survey,
    categoryUuid: NodeDefs.getCategoryUuid(nodeDef),
  });
  if (!category) return false;

  return samplingPointDataCategoryName === category.props?.name;
};

export const SurveyDefs = {
  getEntitySummaryDefs,
  hasSamplingPointDataLocation,
  isCodeAttributeFromSamplingPointData,
};
