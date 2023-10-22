import React from "react";

import { Dropdown, Text } from "components";
import { SurveySelectors } from "state";

export const SrsDropdown = (props) => {
  const { editable, onChange, value } = props;

  const survey = SurveySelectors.useCurrentSurvey();
  const srss = survey.props.srs;
  const singleSrs = srss.length === 1;

  const items = srss.map((srs) => ({ value: srs.code, label: srs.name }));

  const selectedValue = value ?? singleSrs ? srss[0].code : undefined;

  if (singleSrs) {
    return <Text>{srss[0].name}</Text>;
  }
  return (
    <Dropdown
      disabled={!editable || singleSrs}
      items={items}
      onChange={onChange}
      value={selectedValue}
    />
  );
};
