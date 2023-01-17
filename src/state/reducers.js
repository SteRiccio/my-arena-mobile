import { combineReducers } from "redux";

import { DataEntryReducer } from "./dataEntry/reducer";
import { SurveyReducer } from "./survey/reducer";

export const rootReducer = combineReducers({
  dataEntry: DataEntryReducer,
  survey: SurveyReducer,
});
