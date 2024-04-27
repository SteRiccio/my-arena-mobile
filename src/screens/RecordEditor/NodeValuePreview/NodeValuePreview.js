import { NodeDefType, NodeValueFormatter } from "@openforis/arena-core";

import { Text } from "components";
import { SurveySelectors } from "state";
import { CoordinateValuePreview } from "./CoordinateValuePreview";
import { BooleanValuePreview } from "./BooleanValuePreview";

export const NodeValuePreview = (props) => {
  const { nodeDef, value } = props;

  if (__DEV__) {
    console.log("rendering NodeValuePreview");
  }

  const survey = SurveySelectors.useCurrentSurvey();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  if (nodeDef.type === NodeDefType.boolean) {
    return <BooleanValuePreview nodeDef={nodeDef} value={value} />;
  }
  if (nodeDef.type === NodeDefType.coordinate) {
    return <CoordinateValuePreview nodeDef={nodeDef} value={value} />;
  }
  const valueFormatted = NodeValueFormatter.format({
    survey,
    nodeDef,
    value,
    showLabel: true,
    lang,
  });
  return <Text>{valueFormatted}</Text>;
};
