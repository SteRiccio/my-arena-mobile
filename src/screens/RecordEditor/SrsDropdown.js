import React from "react";

import { Dropdown } from "components";
import { SurveySelectors } from "state";

export const SrsDropdown = (props) => {
  const { editable, onChange, value } = props;

  const survey = SurveySelectors.useCurrentSurvey();
  const srss = survey.props.srs;
  const singleSrs = srss.length === 1;

  const items = srss.map((srs) => ({ value: srs.code, label: srs.name }));

  const selectedValue = value ? value : singleSrs ? srss[0].code : undefined;

  return (
    <Dropdown
      disabled={!editable || singleSrs}
      items={items}
      onChange={onChange}
      value={selectedValue}
    />
  );
};
