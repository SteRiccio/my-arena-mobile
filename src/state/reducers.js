import { combineReducers } from "redux";

import { ConfirmReducer } from "./confirm";
import { DataEntryReducer } from "./dataEntry";
import { JobMonitorReducer } from "./jobMonitor";
import { MessageReducer } from "./message";
import { RemoteConnectionReducer } from "./remoteConnection";
import { SettingsReducer } from "./settings";
import { SurveyReducer } from "./survey";
import { SurveyOptionsReducer } from "./surveyOptions";

export const rootReducer = combineReducers({
  confirm: ConfirmReducer,
  dataEntry: DataEntryReducer,
  jobMonitor: JobMonitorReducer,
  message: MessageReducer,
  remoteConnection: RemoteConnectionReducer,
  settings: SettingsReducer,
  survey: SurveyReducer,
  surveyOptions: SurveyOptionsReducer,
});
