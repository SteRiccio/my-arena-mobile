import { combineReducers } from "redux";

import { ConfirmReducer } from "./confirm/reducer";
import { DataEntryReducer } from "./dataEntry/reducer";
import { MessageReducer } from "./message/reducer";
import { RemoteConnectionReducer } from "./remoteConnection/reducer";
import { SurveyReducer } from "./survey/reducer";

export const rootReducer = combineReducers({
  confirm: ConfirmReducer,
  dataEntry: DataEntryReducer,
  message: MessageReducer,
  remoteConnection: RemoteConnectionReducer,
  survey: SurveyReducer,
});
