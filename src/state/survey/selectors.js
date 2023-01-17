import { useSelector } from "react-redux";

import { Surveys } from "@openforis/arena-core";
import { createSelector } from "reselect";

const selectCurrentSurvey = (state) => state.survey.currentSurvey;

const selectCurrentSurveyPreferredLang = createSelector(
  [selectCurrentSurvey],
  (survey) => survey.props.languages[0]
);

const selectCurrentSurveyNodeDefByUuid = createSelector(
  [selectCurrentSurvey],
  (survey, uuid) => Surveys.getNodeDefByUuid({ survey, uuid })
);

export const SurveySelectors = {
  selectCurrentSurvey,
  
  useCurrentSurvey: () => useSelector(selectCurrentSurvey),
  useCurrentSurveyPreferredLang: () =>
    useSelector(selectCurrentSurveyPreferredLang),
  useCurrentSurveyRootDef: () =>
    useSelector((state) => {
      const survey = selectCurrentSurvey(state);
      return Surveys.getNodeDefRoot({ survey });
    }),
  useCurrentSurveyNodeDefByUuid: (uuid) =>
    useSelector((state) => selectCurrentSurveyNodeDefByUuid(state, uuid)),
};
