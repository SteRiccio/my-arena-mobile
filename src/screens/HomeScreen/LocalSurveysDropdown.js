import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Dropdown } from "../../components";
import { screenKeys } from "../../navigation/screens";
import { SurveyService } from "../../service/surveyService";
import { SurveyActions } from "../../state/survey/actions";

const importSurveyOption = "--- Import survey from server ---";

export const LocalSurveysDropdown = (props) => {
  const { navigation } = props;

  const dispatch = useDispatch();

  const [state, setState] = useState({
    options: [],
    surveySummaries: [],
    loading: true,
  });
  const { options, surveySummaries } = state;

  useEffect(() => {
    const initialize = async () => {
      const surveySummaries = await SurveyService.fetchSurveySummariesLocal();
      const options = surveySummaries.map(
        (surveySummary) => surveySummary.name
      );
      options.push(importSurveyOption);
      setState((statePrev) => ({ ...statePrev, surveySummaries, options }));
    };
    initialize();
  }, []);

  const onSelect = useCallback(
    async (selectedIndex) => {
      if (selectedIndex < surveySummaries.length) {
        const surveySummary = surveySummaries[selectedIndex];
        const surveyId = surveySummary.id;
        dispatch(
          SurveyActions.fetchAndSetCurrentSurvey({ surveyId, navigation })
        );
      } else {
        navigation.navigate(screenKeys.surveysListRemote);
      }
    },
    [surveySummaries, navigation]
  );

  return <Dropdown options={options} onSelect={onSelect} />;
};
