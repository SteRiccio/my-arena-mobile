import { StoreUtils } from "../storeUtils";
import { SurveyActionTypes } from "./actionTypes";

const actionHandlers = {
  [SurveyActionTypes.CURRENT_SURVEY_SET]: ({ state, action }) => ({
    ...state,
    currentSurvey: action.survey,
    currentSurveyPreferredLanguage: action.survey.props.languages[0],
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
