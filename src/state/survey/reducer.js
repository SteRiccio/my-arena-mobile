import { StoreUtils } from "../storeUtils";
import { SurveyActionTypes } from "./actionTypes";

const actionHandlers = {
  [SurveyActionTypes.CURRENT_SURVEY_SET]: ({ state, action }) => {
    const { survey } = action;
    return {
      ...state,
      currentSurvey: survey,
      currentSurveyPreferredLanguage: survey?.props?.languages?.[0],
    };
  },
  [SurveyActionTypes.CURRENT_SURVEY_PREFERRED_LANG_SET]: ({
    state,
    action,
  }) => ({
    ...state,
    currentSurveyPreferredLanguage: action.lang,
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
