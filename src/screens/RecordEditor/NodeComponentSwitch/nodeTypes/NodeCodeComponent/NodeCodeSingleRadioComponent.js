import React from "react";
import { RadioButton } from "react-native-paper";

import { CategoryItems } from "@openforis/arena-core";

import { HView } from "../../../../../components";
import { SurveySelectors } from "../../../../../state/survey/selectors";

export const NodeCodeSingleRadioComponent = (props) => {
  const { editable, items, onChange, value } = props;

  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  return (
    <RadioButton.Group onValueChange={onChange} value={value}>
      <HView>
        {items.map((item) => (
          <RadioButton.Item
            key={item.uuid}
            label={CategoryItems.getLabelOrCode(item, lang)}
            disabled={!editable}
            value={item.uuid}
          />
        ))}
      </HView>
    </RadioButton.Group>
  );
};
