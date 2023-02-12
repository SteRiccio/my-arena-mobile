import "react-native-get-random-values";

import { RecordFactory, Records, RecordUpdater } from "@openforis/arena-core";

import { SurveySelectors } from "../survey/selectors";
import { DataEntrySelectors } from "./selectors";
import { RecordService } from "../../service/recordService";
import { screens } from "../../navigation/AppStack";

const CURRENT_RECORD_SET = "CURRENT_RECORD_SET";
const ENTITY_IN_PAGE_SET = "ENTITY_IN_PAGE_SET";

const createNewRecord =
  ({ navigation }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = state.survey.currentSurvey;
    const recordEmpty = RecordFactory.createInstance({
      surveyUuid: survey.uuid,
      user: {},
    });
    const { record } = await RecordUpdater.createRootEntity({
      survey,
      record: recordEmpty,
    });

    record.surveyId = survey.id;

    await RecordService.insertRecord({ survey, record });

    dispatch({ type: CURRENT_RECORD_SET, record });

    navigation.navigate(screens.recordEditor.key);
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

    await RecordService.updateRecord({ survey, record });

    dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated });
  };

const selectEntityInPage = ({ pageUuid, entityUuid }) => {
  dispatch({ type: ENTITY_IN_PAGE_SET, pageUuid, entityUuid });
};

export const DataEntryActions = {
  CURRENT_RECORD_SET,
  ENTITY_IN_PAGE_SET,

  createNewRecord,
  updateCurrentRecordAttribute,
  selectEntityInPage,
};
