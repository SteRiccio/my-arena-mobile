import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Dropdown } from "components";
import { screenKeys } from "../screenKeys";
import { SurveyService } from "service";
import { SurveyActions } from "state";

const importSurveyItem = {
  value: "___IMPORT_SURVEY____",
  label: "--- Import survey from server ---",
};

export const LocalSurveysDropdown = (props) => {
  const { navigation } = props;

  const dispatch = useDispatch();

  const [state, setState] = useState({
    items: [],
    surveySummaries: [],
    loading: true,
  });
  const { items, surveySummaries } = state;

  useEffect(() => {
    const initialize = async () => {
      const surveySummaries = await SurveyService.fetchSurveySummariesLocal();
      const _items = surveySummaries.map((surveySummary) => ({
        value: surveySummary.uuid,
        label: surveySummary.name,
      }));
      _items.push(importSurveyItem);
      setState((statePrev) => ({
        ...statePrev,
        surveySummaries,
        items: _items,
      }));
    };
    initialize();
  }, []);

  const onChange = useCallback(
    async (val) => {
      if (val === importSurveyItem.value) {
        navigation.navigate(screenKeys.surveysListRemote);
      } else {
        const surveySummary = surveySummaries.find(
          (surveySummary) => surveySummary.uuid === val
        );
        const surveyId = surveySummary.id;
        dispatch(
          SurveyActions.fetchAndSetCurrentSurvey({ surveyId, navigation })
        );
      }
    },
    [surveySummaries, navigation]
  );

  return <Dropdown items={items} onChange={onChange} />;
};
