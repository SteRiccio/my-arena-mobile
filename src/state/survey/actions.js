import { screenKeys } from "screens/screenKeys";
import { SurveyService } from "service";

const CURRENT_SURVEY_SET = "CURRENT_SURVEY_SET";

const setCurrentSurvey =
  ({ survey, navigation }) =>
  (dispatch) => {
    dispatch({ type: CURRENT_SURVEY_SET, survey });
    navigation.navigate(screenKeys.recordsList);
  };

const fetchAndSetCurrentSurvey =
  ({ surveyId, navigation }) =>
  async (dispatch) => {
    const survey = await SurveyService.fetchSurveyById(surveyId);
    dispatch(setCurrentSurvey({ survey, navigation }));
  };

const importSurveyRemote =
  ({ surveyId, cycle, navigation }) =>
  async (dispatch) => {
    const survey = await SurveyService.importSurveyRemote({
      id: surveyId,
      cycle,
    });
    dispatch(setCurrentSurvey({ survey, navigation }));
  };

const deleteSurveys = (surveyIds) => async (_dispatch, getState) => {
  await SurveyService.deleteSurveys(surveyIds);
};

export const SurveyActions = {
  CURRENT_SURVEY_SET,

  setCurrentSurvey,
  fetchAndSetCurrentSurvey,
  importSurveyRemote,
  deleteSurveys,
};
