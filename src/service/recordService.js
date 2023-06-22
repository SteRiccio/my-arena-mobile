import { Dates, NodeDefs, Objects, Surveys } from "@openforis/arena-core";
import { AbstractService } from "./abstractService";
import { RecordRepository } from "./repository/recordRepository";
import { RecordSyncStatus } from "model/RecordSyncStatus";

const { fetchRecord, fetchRecords, insertRecord, updateRecord, deleteRecords } =
  RecordRepository;

const fetchRecordsSummariesRemote = async ({ surveyRemoteId }) => {
  try {
    const { data } = await AbstractService.get(
      `api/survey/${surveyRemoteId}/records/summary`
    );
    const { list } = data;
    return list;
  } catch (error) {
    return AbstractService.handleError({ error });
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

export const RecordService = {
  fetchRecord,
  fetchRecords,
  fetchRecordsWithSyncStatus,
  insertRecord,
  updateRecord,
  deleteRecords,
};
