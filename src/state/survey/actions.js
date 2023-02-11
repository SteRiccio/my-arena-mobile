const CURRENT_SURVEY_SET = "CURRENT_SURVEY_SET";

const setCurrentSurvey = (survey) => (dispatch) => {
  return dispatch({ type: CURRENT_SURVEY_SET, survey });
};

export const SurveyActions = {
  CURRENT_SURVEY_SET,

  setCurrentSurvey,
};
