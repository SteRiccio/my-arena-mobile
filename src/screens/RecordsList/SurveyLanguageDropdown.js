import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import { Dropdown } from "components";
import { SurveyActions, SurveySelectors } from "state";
import { Languages } from "@openforis/arena-core";

export const SurveyLanguageDropdown = () => {
  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();
  const preferredLang = SurveySelectors.useCurrentSurveyPreferredLang();

  const languages = survey.props.languages;
  const singleLanguage = languages.length === 1;

  const items = languages.map((lang) => ({
    value: lang,
    label: Languages[lang]["en"],
  }));

  const selectedValue = preferredLang
    ? preferredLang
    : singleLanguage
    ? languages[0]
    : undefined;

  const onChange = useCallback((selectedLang) => {
    dispatch(
      SurveyActions.setCurrentSurveyPreferredLanguage({ lang: selectedLang })
    );
  }, []);

  return (
    <Dropdown
      disabled={singleLanguage}
      items={items}
      label="dataEntry:formLanguage"
      onChange={onChange}
      value={selectedValue}
    />
  );
};
