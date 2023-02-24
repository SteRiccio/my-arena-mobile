import "react-native-get-random-values";

import { RecordFactory, Records, RecordUpdater } from "@openforis/arena-core";

import { SurveySelectors } from "../survey/selectors";
import { DataEntrySelectors } from "./selectors";
import { RecordService } from "../../service/recordService";
import { screenKeys } from "../../navigation/screens";

const CURRENT_RECORD_SET = "CURRENT_RECORD_SET";
const ENTITY_IN_PAGE_SET = "ENTITY_IN_PAGE_SET";

const createNewRecord =
  ({ navigation }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
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

    dispatch(editRecord({ navigation, record }));
  };

const editRecord =
  ({ navigation, record }) =>
  (dispatch) => {
    dispatch({ type: CURRENT_RECORD_SET, record });
    navigation.navigate(screenKeys.recordEditor);
  };

const fetchAndEditRecord =
  ({ navigation, recordId }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = await RecordService.fetchRecord({ survey, recordId });
    dispatch(editRecord({ navigation, record }));
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

const toggleRecordPageMenuOpen = (dispatch, getState) => {
  const state = getState();
  const open = DataEntrySelectors.selectRecordPageSelectorMenuOpen(state);
  dispatch({ type: PAGE_SELECTOR_MENU_OPEN_SET, open: !open });
};

export const DataEntryActions = {
  CURRENT_RECORD_SET,
  ENTITY_IN_PAGE_SET,

  createNewRecord,
  fetchAndEditRecord,
  updateCurrentRecordAttribute,
  selectEntityInPage,
  toggleRecordPageMenuOpen,
};
