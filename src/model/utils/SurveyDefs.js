import {
  Surveys,
  NodeDefs,
  NodeDefType,
  Categories,
} from "@openforis/arena-core";

const samplingPointDataCategoryName = "sampling_point_data";

const getRootKeyDefs = ({ survey, cycle }) => {
  const rootDef = Surveys.getNodeDefRoot({ survey });
  return Surveys.getNodeDefKeys({ survey, nodeDef: rootDef, cycle });
};

const getChildrenDefs = ({ survey, nodeDef, cycle }) =>
  Surveys.getNodeDefChildrenSorted({
    survey,
    nodeDef,
    cycle,
    includeAnalysis: false,
  }).filter(
    (childDef) =>
      !NodeDefs.isHidden(childDef) &&
      !NodeDefs.isHiddenInMobile(cycle)(childDef) &&
      NodeDefs.isInCycle(cycle)(childDef)
  );

const getEntitySummaryDefs = ({
  survey,
  entityDef,
  record,
  onlyKeys = true,
  maxSummaryDefs = 3,
}) => {
  const { cycle } = record;
  const keyDefs = Surveys.getNodeDefKeys({ survey, cycle, nodeDef: entityDef });

  if (onlyKeys) {
    return keyDefs;
  }
  const defsIncludedInSummary =
    Surveys.getNodeDefsIncludedInMultipleEntitySummary({
      survey,
      cycle,
      nodeDef: entityDef,
    });
  const summaryDefs = [...keyDefs, ...defsIncludedInSummary];

  const otherDefsToAddCount = maxSummaryDefs - summaryDefs.length;

  if (otherDefsToAddCount > 0) {
    const entityDefChildrenNotKeys = getChildrenDefs({
      survey,
      nodeDef: entityDef,
      cycle,
    }).filter(
      (childDef) =>
        !NodeDefs.isKey(childDef) &&
        !NodeDefs.isMultiple(childDef) &&
        !NodeDefs.isIncludedInMultipleEntitySummary(cycle)(childDef)
    );
    if (entityDefChildrenNotKeys.length > 0) {
      summaryDefs.push(
        ...entityDefChildrenNotKeys.slice(
          0,
          Math.min(entityDefChildrenNotKeys.length, otherDefsToAddCount)
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
  getRootKeyDefs,
  getChildrenDefs,
  getEntitySummaryDefs,
  hasSamplingPointDataLocation,
  isCodeAttributeFromSamplingPointData,
};
