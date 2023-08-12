import { StoreUtils } from "../storeUtils";

import { RecordEditViewMode } from "model";
import { SurveyActionTypes } from "state";
import { SurveyOptionsActions } from "./actions";

const initialState = {
  recordEditViewMode: RecordEditViewMode.form,
};

const actionHandlers = {
  [SurveyActionTypes.CURRENT_SURVEY_SET]: () => ({ ...initialState }),

  [SurveyOptionsActions.RECORD_EDIT_VIEW_MODE_SET]: ({ state, action }) => ({
    ...state,
    recordEditViewMode: action.viewMode,
  }),
};

export const SurveyOptionsReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState,
});
