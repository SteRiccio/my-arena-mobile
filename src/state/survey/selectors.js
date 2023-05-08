import { useSelector } from "react-redux";

import { Surveys } from "@openforis/arena-core";

const getSurveyState = (state) => state.survey;

const selectCurrentSurvey = (state) => getSurveyState(state).currentSurvey;

const selectSurveysLocal = (state) => getSurveyState(state).surveysLocal;

const selectCurrentSurveyPreferredLang = (state) =>
  getSurveyState(state).currentSurveyPreferredLanguage;

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
  useSurveysLocal: () => useSelector(selectSurveysLocal),
};
