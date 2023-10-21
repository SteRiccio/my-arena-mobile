import { screenKeys } from "screens/screenKeys";
import { PreferencesService, SurveyService } from "service";
import { SurveyActionTypes } from "./actionTypes";
import { ConfirmActions } from "..";

const {
  CURRENT_SURVEY_SET,
  CURRENT_SURVEY_PREFERRED_LANG_SET,
  SURVEYS_LOCAL_SET,
} = SurveyActionTypes;

const setCurrentSurvey =
  ({ survey, navigation = null }) =>
  async (dispatch) => {
    dispatch({ type: CURRENT_SURVEY_SET, survey });
    await PreferencesService.setCurrentSurveyId(survey.id);
    navigation?.navigate(screenKeys.recordsList);
  };

const setCurrentSurveyPreferredLanguage =
  ({ lang }) =>
  (dispatch) => {
    dispatch({ type: CURRENT_SURVEY_PREFERRED_LANG_SET, lang });
  };

const fetchAndSetCurrentSurvey =
  ({ surveyId, navigation = null }) =>
  async (dispatch) => {
    const survey = await SurveyService.fetchSurveyById(surveyId);
    if (survey) {
      dispatch(setCurrentSurvey({ survey, navigation }));
    }
  };

const fetchAndSetLocalSurveys = () => async (dispatch) => {
  const surveys = await SurveyService.fetchSurveySummariesLocal();
  dispatch({ type: SURVEYS_LOCAL_SET, surveys });
};

const _onSurveyInsertOrUpdate =
  ({ survey, navigation }) =>
  async (dispatch) => {
    dispatch(setCurrentSurvey({ survey, navigation }));
    dispatch(fetchAndSetLocalSurveys());
  };

const importSurveyRemote =
  ({ surveyId, navigation }) =>
  async (dispatch) => {
    const survey = await SurveyService.importSurveyRemote({ id: surveyId });
    dispatch(_onSurveyInsertOrUpdate({ survey, navigation }));
  };

const updateSurveyRemote =
  ({
    surveyId,
    surveyName,
    surveyRemoteId,
    navigation,
    onConfirm = null,
    onComplete = null,
  }) =>
  async (dispatch) => {
    dispatch(
      ConfirmActions.show({
        confirmButtonTextKey: "surveys:updateSurvey",
        messageKey: "surveys:updateSurveyConfirmMessage",
        messageParams: { surveyName },
        onConfirm: async () => {
          onConfirm?.();
          const survey = await SurveyService.updateSurveyRemote({
            surveyId,
            surveyRemoteId,
          });
          dispatch(_onSurveyInsertOrUpdate({ survey, navigation }));
          onComplete?.();
        },
      })
    );
  };

const deleteSurveys = (surveyIds) => async (dispatch, getState) => {
  const state = getState();
  const surveyState = state.survey;
  await SurveyService.deleteSurveys(surveyIds);
  dispatch(fetchAndSetLocalSurveys());

  // reset current survey if among deleted ones
  if (surveyIds.includes(surveyState.currentSurvey?.id)) {
    dispatch({ type: CURRENT_SURVEY_SET, survey: null });
    await PreferencesService.clearCurrentSurveyId();
  }
};

export const SurveyActions = {
  setCurrentSurvey,
  setCurrentSurveyPreferredLanguage,
  fetchAndSetCurrentSurvey,
  fetchAndSetLocalSurveys,
  importSurveyRemote,
  updateSurveyRemote,
  deleteSurveys,
};
