import "react-native-get-random-values";

import { RecordFactory, Records, RecordUpdater } from "@openforis/arena-core";

import { SurveySelectors } from "../survey/selectors";
import { DataEntrySelectors } from "./selectors";
import { RecordService } from "../../service/recordService";

const CURRENT_RECORD_SET = "CURRENT_RECORD_SET";

const createNewRecord =
  ({ navigation }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = state.survey.currentSurvey;
    const record = RecordFactory.createInstance({
      surveyUuid: survey.uuid,
      user: {},
    });
    const { record: recordInitialized } = await RecordUpdater.createRootEntity({
      survey,
      record,
    });

    record.surveyId = survey.id;

    await RecordService.insertRecord(record);

    dispatch({ type: CURRENT_RECORD_SET, record: recordInitialized });

    navigation.navigate("RecordEditor");
  };

const updateCurrentRecordAttribute =
  ({ uuid, value }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);

    const node = Records.getNodeByUuid(uuid)(record);

    const nodeUpdated = { ...node, value };

    const { record: recordUpdated } = await RecordUpdater.updateNode({
      survey,
      record,
      node: nodeUpdated,
    });

    await RecordService.updateRecord(record);

    dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated });
  };

export const DataEntryActions = {
  CURRENT_RECORD_SET,

  createNewRecord,
  updateCurrentRecordAttribute,
};
