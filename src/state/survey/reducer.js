import { StoreUtils } from "../storeUtils";
import { SurveyActions } from "./actions";

const actionHandlers = {
  [SurveyActions.CURRENT_SURVEY_SET]: ({ state, action }) => ({
    ...state,
    currentSurvey: action.survey,
    currentSurveyPreferredLanguage: action.survey.props.languages[0],
  }),
  [SurveyActions.SURVEYS_LOCAL_SET]: ({ state, action }) => ({
    ...state,
    surveysLocal: action.surveys,
  }),
};

export const SurveyReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState: false,
});
