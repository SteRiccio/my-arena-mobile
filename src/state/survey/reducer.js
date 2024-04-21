import { Surveys } from "@openforis/arena-core";
import { StoreUtils } from "../storeUtils";
import { SurveyActionTypes } from "./actionTypes";

const actionHandlers = {
  [SurveyActionTypes.CURRENT_SURVEY_SET]: ({ state, action }) => {
    const { survey } = action;
    return {
      ...state,
      currentSurvey: survey,
      currentSurveyPreferredLanguage: Surveys.getDefaultLanguage(survey),
      currentSurveyCycle: Surveys.getDefaultCycleKey(survey),
    };
  },
  [SurveyActionTypes.CURRENT_SURVEY_PREFERRED_LANG_SET]: ({
    state,
    action,
  }) => ({
    ...state,
    currentSurveyPreferredLanguage: action.lang,
  }),
  [SurveyActionTypes.CURRENT_SURVEY_CYCLE_SET]: ({ state, action }) => ({
    ...state,
    currentSurveyCycle: action.cycleKey,
  }),
  [SurveyActionTypes.SURVEYS_LOCAL_SET]: ({ state, action }) => ({
    ...state,
    surveysLocal: action.surveys,
  }),
};

export const SurveyReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState: false,
});
