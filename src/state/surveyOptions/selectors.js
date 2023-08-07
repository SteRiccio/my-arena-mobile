import { useSelector } from "react-redux";

const getSurveyOptionsState = (state) => state.surveyOptions;

const selectRecordEditViewMode = (state) =>
  getSurveyOptionsState(state).recordEditViewMode;

export const SurveyOptionsSelectors = {
  selectRecordEditViewMode,

  useRecordEditViewMode: () => useSelector(selectRecordEditViewMode),
};
