const getCoordinateNodeDefIncludedExtraFields = (nodeDef) => {
  const result = [];
  if (nodeDef.props.includeAccuracy) result.push("accuracy");
  if (nodeDef.props.includeAltitude) result.push("altitude");
  if (nodeDef.props.includeAltitudeAccuracy) result.push("altitudeAccuracy");
  return result;
};

export const SurveyNodeDefs = {
  getCoordinateNodeDefIncludedExtraFields,
};
