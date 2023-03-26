import { combineReducers } from "redux";

import { DataEntryReducer } from "./dataEntry/reducer";
import { MessageReducer } from "./message/reducer";
import { RemoteConnectionReducer } from "./remoteConnection/reducer";
import { SurveyReducer } from "./survey/reducer";

export const rootReducer = combineReducers({
  dataEntry: DataEntryReducer,
  message: MessageReducer,
  remoteConnection: RemoteConnectionReducer,
  survey: SurveyReducer,
});
