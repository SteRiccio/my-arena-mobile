import React from "react";
import {
  NodeDefType,
  NodeValueFormatter,
  Objects,
} from "@openforis/arena-core";

import { Text } from "components";
import { SurveySelectors } from "state";

import { CoordinateValuePreview } from "./CoordinateValuePreview";
import { BooleanValuePreview } from "./BooleanValuePreview";
import { FileValuePreview } from "./FileValuePreview";
import { NodeValuePreviewPropTypes } from "./NodeValuePreviewPropTypes";

const componentByNodeDefType = {
  [NodeDefType.boolean]: BooleanValuePreview,
  [NodeDefType.coordinate]: CoordinateValuePreview,
  [NodeDefType.file]: FileValuePreview,
};

export const NodeValuePreview = (props) => {
  const { nodeDef, value } = props;

  if (__DEV__) {
    console.log("rendering NodeValuePreview");
  }

  if (Objects.isEmpty(value)) {
    return <Text>---</Text>;
  }

  const survey = SurveySelectors.useCurrentSurvey();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const component = componentByNodeDefType[nodeDef.type];
  if (component) {
    return React.createElement(component, { nodeDef, value });
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

NodeValuePreview.propTypes = NodeValuePreviewPropTypes;
