import { useSelector } from "react-redux";

import { Objects, Surveys } from "@openforis/arena-core";

import { SurveyDefs } from "model";

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

const selectIsNodeDefRootKey = (nodeDef) => (state) => {
  const survey = selectCurrentSurvey(state);
  const keyDefs = SurveyDefs.getRootKeyDefs({ survey });
  return keyDefs.some((keyDef) => keyDef === nodeDef);
};

const selectSurveysLocal = (state) => getSurveyState(state).surveysLocal;

const selectCurrentSurveyPreferredLang = (state) =>
  getSurveyState(state).currentSurveyPreferredLanguage;

const selectCurrentSurveyCycle = (state) =>
  getSurveyState(state).currentSurveyCycle;

export const SurveySelectors = {
  selectCurrentSurvey,
  selectCurrentSurveyCycle,
  selectCurrentSurveyPreferredLang,

  useCurrentSurvey: () => useSelector(selectCurrentSurvey),
  useCurrentSurveySrsIndex: () =>
    useSelector(selectCurrentSurveySrsIndex, Objects.isEqual),
  useCurrentSurveyPreferredLang: () =>
    useSelector(selectCurrentSurveyPreferredLang),
  useCurrentSurveyCycle: () => useSelector(selectCurrentSurveyCycle),
  useCurrentSurveyRootDef: () => useSelector(selectCurrentSurveyRootDef),
  useIsNodeDefEnumerator: (nodeDef) =>
    useSelector(selectIsNodeDefEnumerator(nodeDef)),
  useIsNodeDefRootKey: (nodeDef) =>
    useSelector(selectIsNodeDefRootKey(nodeDef)),
  useSurveysLocal: () => useSelector(selectSurveysLocal),
};
