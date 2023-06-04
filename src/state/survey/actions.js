import { screenKeys } from "screens/screenKeys";
import { SurveyService } from "service";
import { SurveyActionTypes } from "./actionTypes";

const { CURRENT_SURVEY_SET, SURVEYS_LOCAL_SET } = SurveyActionTypes;

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

const fetchAndSetLocalSurveys = () => async (dispatch) => {
  const surveys = await SurveyService.fetchSurveySummariesLocal();
  dispatch({ type: SURVEYS_LOCAL_SET, surveys });
};

const importSurveyRemote =
  ({ surveyId, cycle, navigation }) =>
  async (dispatch) => {
    const survey = await SurveyService.importSurveyRemote({
      id: surveyId,
      cycle,
    });
    dispatch(setCurrentSurvey({ survey, navigation }));
    dispatch(fetchAndSetLocalSurveys());
  };

const deleteSurveys = (surveyIds) => async (dispatch) => {
  await SurveyService.deleteSurveys(surveyIds);
  dispatch(fetchAndSetLocalSurveys());
};

export const SurveyActions = {
  setCurrentSurvey,
  fetchAndSetCurrentSurvey,
  fetchAndSetLocalSurveys,
  importSurveyRemote,
  deleteSurveys,
};
