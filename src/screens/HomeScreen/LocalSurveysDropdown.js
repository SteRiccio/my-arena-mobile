import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Dropdown } from "components";
import { SurveyActions, SurveySelectors } from "state";

export const LocalSurveysDropdown = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const surveySummaries = SurveySelectors.useSurveysLocal();

  const onChange = useCallback(
    async (surveyId) => {
      dispatch(
        SurveyActions.fetchAndSetCurrentSurvey({ surveyId, navigation })
      );
    },
    [surveySummaries, navigation]
  );

  return (
    <Dropdown
      items={surveySummaries}
      itemKeyExtractor={(item) => item.id}
      itemLabelExtractor={(item) => item.name}
      label="Select a survey"
      onChange={onChange}
      value={null}
    />
  );
};
