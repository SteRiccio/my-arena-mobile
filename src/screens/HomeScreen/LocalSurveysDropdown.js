import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Autocomplete } from "components";
import { SurveyActions, SurveySelectors } from "state";
import { useNavigation } from "@react-navigation/native";

export const LocalSurveysDropdown = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const surveySummaries = SurveySelectors.useSurveysLocal();

  const onChange = useCallback(
    async (selectedItems) => {
      const surveySummary = selectedItems[0];
      const surveyId = surveySummary.id;
      dispatch(
        SurveyActions.fetchAndSetCurrentSurvey({ surveyId, navigation })
      );
    },
    [surveySummaries, navigation]
  );

  return (
    <Autocomplete
      items={surveySummaries}
      itemKeyExtractor={(item) => item.uuid}
      itemLabelExtractor={(item) => item.name}
      onSelectedItemsChange={onChange}
      selectedItems={[]}
    />
  );
};
