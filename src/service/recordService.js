import { Dates, NodeDefs, Objects, Surveys } from "@openforis/arena-core";
import { RemoteService } from "./remoteService";
import { RecordRepository } from "./repository/recordRepository";
import { RecordSyncStatus } from "model";
import { Files } from "utils";

const {
  fetchRecord,
  fetchRecords,
  insertRecord,
  updateRecord,
  deleteRecords,
  fixRecordCycle,
} = RecordRepository;

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

  if (Dates.isAfter(dateModifiedLocal, dateModifiedRemote)) {
    return RecordSyncStatus.modifiedLocally;
  } else if (Dates.isBefore(dateModifiedLocal, dateModifiedRemote)) {
    return RecordSyncStatus.modifiedRemotely;
  } else {
    return RecordSyncStatus.notModified;
  }
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
  const params = {
    file: {
      uri: fileUri,
      name: "arena-mobile-data.zip",
      type: Files.MIME_TYPES.zip,
    },
    cycle,
    conflictResolutionStrategy: "overwriteIfUpdated",
  };
  const { data } = await RemoteService.postMultipartData(
    `api/mobile/survey/${surveyRemoteId}`,
    params
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
  fixRecordCycle,
};
