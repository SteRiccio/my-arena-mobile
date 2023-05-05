import { combineReducers } from "redux";

import { ConfirmReducer } from "./confirm";
import { DataEntryReducer } from "./dataEntry";
import { MessageReducer } from "./message";
import { RemoteConnectionReducer } from "./remoteConnection";
import { SettingsReducer } from "./settings";
import { SurveyReducer } from "./survey";

export const rootReducer = combineReducers({
  confirm: ConfirmReducer,
  dataEntry: DataEntryReducer,
  message: MessageReducer,
  remoteConnection: RemoteConnectionReducer,
  settings: SettingsReducer,
  survey: SurveyReducer,
});
