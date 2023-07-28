const getCoordinateNodeDefIncludedExtraFields = (nodeDef) => {
  const result = [];
  if (nodeDef.props.includeAccuracy) result.push("accuracy");
  if (nodeDef.props.includeElevation) result.push("elevation");
  if (nodeDef.props.includeElevationAccuracy) result.push("elevationAccuracy");
  return result;
};

export const SurveyNodeDefs = {
  getCoordinateNodeDefIncludedExtraFields,
};
