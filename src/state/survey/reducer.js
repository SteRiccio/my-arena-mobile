import { StoreUtils } from "../storeUtils";
import { SurveyActions } from "./actions";

const actionHandlers = {
  [SurveyActions.CURRENT_SURVEY_SET]: ({ state, action }) => ({
    ...state,
    currentSurvey: action.survey,
  }),
};

export const SurveyReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState: false,
});
