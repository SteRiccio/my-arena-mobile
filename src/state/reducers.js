import { combineReducers } from "redux";

import { ConfirmReducer } from "./confirm/reducer";
import { DataEntryReducer } from "./dataEntry/reducer";
import { MessageReducer } from "./message/reducer";
import { RemoteConnectionReducer } from "./remoteConnection/reducer";
import { SettingsReducer } from "./settings/reducer";
import { SurveyReducer } from "./survey/reducer";

export const rootReducer = combineReducers({
  confirm: ConfirmReducer,
  dataEntry: DataEntryReducer,
  message: MessageReducer,
  remoteConnection: RemoteConnectionReducer,
  settings: SettingsReducer,
  survey: SurveyReducer,
});
