import { useSelector } from "react-redux";

import { Objects, Surveys } from "@openforis/arena-core";

const getSurveyState = (state) => state.survey;

const selectCurrentSurvey = (state) => getSurveyState(state).currentSurvey;

const selectCurrentSurveySrsIndex = (state) => {
  const survey = selectCurrentSurvey(state);
  return Surveys.getSRSIndex(survey);
};

const selectCurrentSurveyRootDef = (state) => {
  const survey = selectCurrentSurvey(state);
  return Surveys.getNodeDefRoot({ survey });
};

const selectIsNodeDefEnumerator = (nodeDef) => (state) => {
  const survey = selectCurrentSurvey(state);
  return Surveys.isNodeDefEnumerator({ survey, nodeDef });
};

const selectSurveysLocal = (state) => getSurveyState(state).surveysLocal;

const selectCurrentSurveyPreferredLang = (state) =>
  getSurveyState(state).currentSurveyPreferredLanguage;

const selectCurrentSurveyCycle = (state) =>
  getSurveyState(state).currentSurveyCycle;

export const SurveySelectors = {
  selectCurrentSurvey,

  useCurrentSurvey: () => useSelector(selectCurrentSurvey),
  useCurrentSurveySrsIndex: () =>
    useSelector(selectCurrentSurveySrsIndex, Objects.isEqual),
  useCurrentSurveyPreferredLang: () =>
    useSelector(selectCurrentSurveyPreferredLang),
  useCurrentSurveyCycle: () => useSelector(selectCurrentSurveyCycle),
  useCurrentSurveyRootDef: () => useSelector(selectCurrentSurveyRootDef),
  useIsNodeDefEnumerator: (nodeDef) =>
    useSelector(selectIsNodeDefEnumerator(nodeDef)),
  useSurveysLocal: () => useSelector(selectSurveysLocal),
};
