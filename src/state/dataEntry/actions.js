import "react-native-get-random-values";

import {
  JobStatus,
  NodeDefs,
  NodeDefType,
  RecordFactory,
  Records,
  RecordUpdater,
  Surveys,
} from "@openforis/arena-core";

import { RecordService } from "service/recordService";
import { RecordFileService } from "service/recordFileService";

import { screenKeys } from "screens/screenKeys";

import { SurveySelectors } from "../survey/selectors";
import { DataEntrySelectors } from "./selectors";
import { ConfirmActions } from "state/confirm";
import { RecordsExportFileGenerationJob } from "service/recordsExportFileGenerationJob";
import { AuthService, WebSocketService } from "service";
import { MessageActions } from "state/message";
import { JobMonitorActions } from "state/jobMonitor";

const CURRENT_RECORD_SET = "CURRENT_RECORD_SET";
const PAGE_SELECTOR_MENU_OPEN_SET = "PAGE_SELECTOR_MENU_OPEN_SET";
const CURRENT_PAGE_ENTITY_SET = "CURRENT_PAGE_ENTITY_SET";
const DATA_ENTRY_RESET = "DATA_ENTRY_RESET";

const createNewRecord =
  ({ navigation }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const cycle = Surveys.getDefaultCycleKey(survey);
    const recordEmpty = RecordFactory.createInstance({
      surveyUuid: survey.uuid,
      cycle,
      user: {},
    });

    let { record } = await RecordUpdater.createRootEntity({
      survey,
      record: recordEmpty,
    });

    record.surveyId = survey.id;

    record = await RecordService.insertRecord({ survey, record });

    dispatch(editRecord({ navigation, record }));
  };

const addNewEntity = async (dispatch, getState) => {
  const state = getState();
  const survey = SurveySelectors.selectCurrentSurvey(state);
  const record = DataEntrySelectors.selectRecord(state);
  const { parentEntityUuid: currentParentNodeUuid, entityDef: nodeDef } =
    DataEntrySelectors.selectCurrentPageEntity(state);

  const parentNode = currentParentNodeUuid
    ? Records.getNodeByUuid(currentParentNodeUuid)(record)
    : Records.getRoot(record);

  const { record: recordUpdated, nodes: nodesCreated } =
    await RecordUpdater.createNodeAndDescendants({
      survey,
      record,
      parentNode,
      nodeDef,
    });

  const nodeCreated = Object.values(nodesCreated).find(
    (nodeCreated) => nodeCreated.nodeDefUuid === nodeDef.uuid
  );

  await RecordService.updateRecord({ survey, record: recordUpdated });

  dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated });
  dispatch(
    selectCurrentPageEntity({
      parentEntityUuid: parentNode.uuid,
      entityDefUuid: nodeDef.uuid,
      entityUuid: nodeCreated.uuid,
    })
  );
};

const deleteNodes = (nodeUuids) => async (dispatch, getState) => {
  const state = getState();
  const survey = SurveySelectors.selectCurrentSurvey(state);
  const record = DataEntrySelectors.selectRecord(state);

  const { record: recordUpdated } = await RecordUpdater.deleteNodes({
    survey,
    record,
    nodeUuids,
  });

  await RecordService.updateRecord({ survey, record: recordUpdated });

  dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated });
};

const deleteRecords = (recordUuids) => async (_dispatch, getState) => {
  const state = getState();
  const survey = SurveySelectors.selectCurrentSurvey(state);

  await RecordService.deleteRecords({ surveyId: survey.id, recordUuids });
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

const updateAttribute =
  ({ uuid, value, fileUri = null }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);

    const node = Records.getNodeByUuid(uuid)(record);
    const nodeDef = Surveys.getNodeDefByUuid({
      survey,
      uuid: node.nodeDefUuid,
    });

    const { meta } = node;
    const metaUpdated = { ...meta, defaultValueApplied: false };
    const nodeUpdated = { ...node, meta: metaUpdated, value };

    const { record: recordUpdated } = await RecordUpdater.updateNode({
      survey,
      record,
      node: nodeUpdated,
    });

    if (NodeDefs.getType(nodeDef) === NodeDefType.file) {
      const surveyId = survey.id;

      if (fileUri) {
        const { fileUuid: fileUuidNext } = value || {};

        await RecordFileService.saveRecordFile({
          surveyId,
          fileUuid: fileUuidNext,
          sourceFileUri: fileUri,
        });
      }

      const { value: valuePrev } = node;
      const { fileUuid: fileUuidPrev } = valuePrev || {};
      if (fileUuidPrev) {
        await RecordFileService.deleteRecordFile({
          surveyId,
          fileUuid: fileUuidPrev,
        });
      }
    }
    await RecordService.updateRecord({ survey, record: recordUpdated });

    dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated });
  };

const addNewAttribute =
  ({ nodeDef, parentNodeUuid, value = null }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);
    const parentNode = Records.getNodeByUuid(parentNodeUuid)(record);

    const { record: recordUpdated, nodes: nodesCreated } =
      await RecordUpdater.createNodeAndDescendants({
        survey,
        record,
        parentNode,
        nodeDef,
      });

    const nodeCreated = Object.values(nodesCreated).find(
      (nodeCreated) => nodeCreated.nodeDefUuid === nodeDef.uuid
    );
    const nodeUpdated = { ...nodeCreated, value };

    const { record: recordUpdated2 } = await RecordUpdater.updateNode({
      survey,
      record: recordUpdated,
      node: nodeUpdated,
    });

    await RecordService.updateRecord({ survey, record: recordUpdated2 });

    dispatch({ type: CURRENT_RECORD_SET, record: recordUpdated2 });
  };

const selectCurrentPageEntity =
  ({ parentEntityUuid, entityDefUuid, entityUuid = null }) =>
  (dispatch, getState) => {
    const state = getState();
    const { entityDef: prevEntityDef, entityUuid: prevEntityUuid } =
      DataEntrySelectors.selectCurrentPageEntity(state);

    const nextEntityUuid =
      entityDefUuid === prevEntityDef.uuid && entityUuid === prevEntityUuid
        ? null // set pointer to list of entities
        : entityUuid;

    dispatch({
      type: CURRENT_PAGE_ENTITY_SET,
      parentEntityUuid,
      entityDefUuid,
      entityUuid: nextEntityUuid,
    });
  };

const toggleRecordPageMenuOpen = (dispatch, getState) => {
  const state = getState();
  const open = DataEntrySelectors.selectRecordPageSelectorMenuOpen(state);
  dispatch({ type: PAGE_SELECTOR_MENU_OPEN_SET, open: !open });
};

const navigateToRecordsList =
  ({ navigation }) =>
  (dispatch) => {
    dispatch(
      ConfirmActions.show({
        confirmButtonTextKey: "dataEntry:goToListOfRecords",
        messageKey:
          "dataEntry:confirmGoToListOfRecordsAndTerminateRecordEditing",
        onConfirm: () => {
          dispatch({ type: DATA_ENTRY_RESET });
          navigation.navigate(screenKeys.recordsList);
        },
      })
    );
  };

const exportRecords =
  ({ recordUuids }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const cycle =
      survey.props.defaultCycleKey || Surveys.getLastCycleKey(survey);

    //  const fileUri = "content://com.android.externalstorage.documents/tree/primary%3ADownload/document/primary%3ADownload%2Farena_mobile_export_testi_4_2023-07-10_08-02-48.zip";
    // const fileInfo = await getInfoAsync(fileUri);
    // console.log(fileInfo)

    // const remoteJob = await RecordService.uploadRecordsToRemoteServer({
    //       survey,
    //       cycle,
    //       fileUri,
    //     });
    // const jobUuid = remoteJob?.uuid
    // dispatch(JobMonitorActions.start({jobUuid, titleKey: 'dataEntry:exportData'}))

    const user = await AuthService.fetchUser();
    // TODO if user is null, do login

    const job = new RecordsExportFileGenerationJob({
      survey,
      recordUuids,
      user,
    });
    await job.start();
    const { summary } = job;
    const { status, result } = summary;

    if (status === JobStatus.failed) {
      dispatch(
        MessageActions.setMessage({ content: "dataEntry:dataExportError" })
      );
    } else if (status === JobStatus.succeeded) {
      const { outputFileUri } = result || {};

      const remoteJob = await RecordService.uploadRecordsToRemoteServer({
        survey,
        cycle,
        fileUri: outputFileUri,
      });

      dispatch(
        JobMonitorActions.start({
          jobUuid: remoteJob.uuid,
          titleKey: "dataEntry:exportData",
          onClose: () => WebSocketService.close(),
        })
      );
    } else {
      dispatch(
        MessageActions.setMessage({
          content: `Job status: ${status}`,
        })
      );
    }
  };

export const DataEntryActions = {
  CURRENT_RECORD_SET,
  CURRENT_PAGE_ENTITY_SET,
  PAGE_SELECTOR_MENU_OPEN_SET,
  DATA_ENTRY_RESET,

  createNewRecord,
  addNewEntity,
  addNewAttribute,
  deleteNodes,
  deleteRecords,
  fetchAndEditRecord,
  updateAttribute,
  selectCurrentPageEntity,
  toggleRecordPageMenuOpen,

  navigateToRecordsList,
  exportRecords,
};
