import demoSurvey from "../../service/simple_survey.json";

const CURRENT_SURVEY_SET = "CURRENT_SURVEY_SET";

const setDemoSurveyAsCurrent = () => (dispatch) => {
  return dispatch({ type: CURRENT_SURVEY_SET, survey: demoSurvey });
};

export const SurveyActions = {
  CURRENT_SURVEY_SET,

  setDemoSurveyAsCurrent,
};
