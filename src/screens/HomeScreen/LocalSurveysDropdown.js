import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { screenKeys } from "../screenKeys";
import { Dropdown } from "components";
import { SurveyActions, SurveySelectors } from "state";

const importSurveyItem = {
  value: "___IMPORT_SURVEY____",
  label: "--- Import survey from server ---",
};

export const LocalSurveysDropdown = (props) => {
  const { navigation } = props;

  const dispatch = useDispatch();
  const surveySummaries = SurveySelectors.useSurveysLocal();

  const [state, setState] = useState({
    items: [],
  });
  const { items } = state;

  useEffect(() => {
    const _items = surveySummaries.map((surveySummary) => ({
      value: surveySummary.uuid,
      label: surveySummary.name,
    }));
    _items.push(importSurveyItem);

    setState((statePrev) => ({
      ...statePrev,
      items: _items,
    }));
  }, [surveySummaries]);

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
