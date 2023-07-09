import { Dates, NodeDefs, Objects, Surveys } from "@openforis/arena-core";
import { RemoteService } from "./remoteService";
import { RecordRepository } from "./repository/recordRepository";
import { RecordSyncStatus } from "model/RecordSyncStatus";

const { fetchRecord, fetchRecords, insertRecord, updateRecord, deleteRecords } =
  RecordRepository;

const fetchRecordsSummariesRemote = async ({ surveyRemoteId }) => {
  try {
    const { data } = await RemoteService.get(
      `api/survey/${surveyRemoteId}/records/summary`
    );
    const { list } = data;
    return list;
  } catch (error) {
    return RemoteService.handleError({ error });
  }
};

const determineRecordSyncStatus = ({
  survey,
  recordSummaryLocal,
  recordSummaryRemote,
}) => {
  const rootDef = Surveys.getNodeDefRoot({ survey });
  const keyDefs = Surveys.getNodeDefKeys({ survey, nodeDef: rootDef });
  const keysSpecified = keyDefs.every(
    (keyDef) => !!recordSummaryLocal[Objects.camelize(NodeDefs.getName(keyDef))]
  );
  if (!keysSpecified) {
    return RecordSyncStatus.keysNotSpecified;
  }
  if (!recordSummaryRemote) {
    return RecordSyncStatus.new;
  }
  if (recordSummaryRemote.step > 1) {
    return RecordSyncStatus.notInEntryStepAnymore;
  }
  const dateModifiedLocal = new Date(recordSummaryLocal.dateModified);
  const dateModifiedRemote = Dates.parseISO(recordSummaryRemote.dateModified);

  if (dateModifiedLocal === dateModifiedRemote) {
    return RecordSyncStatus.notModified;
  }
  if (dateModifiedLocal > dateModifiedRemote) {
    return RecordSyncStatus.modifiedLocally;
  }
  return RecordSyncStatus.modifiedRemotely;
};

const fetchRecordsWithSyncStatus = async ({ survey }) => {
  const recordsSummariesLocal = await fetchRecords({ survey });
  const recordsSummariesRemote = await fetchRecordsSummariesRemote({
    surveyRemoteId: survey.remoteId,
  });
  return recordsSummariesLocal.map((recordSummaryLocal) => {
    const recordSummaryRemote = recordsSummariesRemote.find(
      (summary) => summary.uuid === recordSummaryLocal.uuid
    );
    const syncStatus = determineRecordSyncStatus({
      survey,
      recordSummaryLocal,
      recordSummaryRemote,
    });
    recordSummaryLocal.syncStatus = syncStatus;
    return recordSummaryLocal;
  });
};

const uploadRecordsToRemoteServer = async ({ survey, cycle, fileUri }) => {
  const surveyRemoteId = survey.remoteId;
  const formData = new FormData();
  formData.append("file", { uri: fileUri });
  formData.append("cycle", cycle);

  const { data } = await RemoteService.postMultipartData(
    `api/mobile/survey/${surveyRemoteId}`,
    formData
  );
  const { job } = data;
  return job;
};

export const RecordService = {
  fetchRecord,
  fetchRecords,
  fetchRecordsWithSyncStatus,
  insertRecord,
  updateRecord,
  deleteRecords,
  uploadRecordsToRemoteServer,
};
