import { ScreenViewMode } from "model/ScreenViewMode";

const stateKey = "surveyOptions";

const keys = {
  recordEditViewMode: "recordEditViewMode",
  viewModesByScreen: "viewModesByScreen",
};

const getRecordEditViewMode = (state) => state[keys.recordEditViewMode];
const getScreenViewMode = (screenKey) => (state) => {
  console.log("===screenKye", screenKey);
  console.log("===state", state);
  const result =
    state?.[keys.viewModesByScreen]?.[screenKey] ?? ScreenViewMode.table;
  console.log("===result", result);
  return result;
};

export const SurveyOptionsState = {
  stateKey,
  keys,

  getRecordEditViewMode,
  getScreenViewMode,
};
