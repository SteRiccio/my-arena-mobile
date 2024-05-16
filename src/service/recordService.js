import { Dates, NodeDefs, Objects } from "@openforis/arena-core";

import {
  RecordLoadStatus,
  RecordOrigin,
  RecordSyncStatus,
  SurveyDefs,
} from "model";
import { ArrayUtils } from "utils";

import { RecordRepository } from "./repository/recordRepository";
import { RecordRemoteService } from "./recordRemoteService";
import { RemoteService } from "./remoteService";

const {
  fetchRecord,
  fetchRecords,
  findRecordIdsByKeys,
  insertRecord,
  insertRecordSummaries,
  updateRecord,
  updateRecordWithContentFetchedRemotely,
  deleteRecords,
  fixRecordCycle,
} = RecordRepository;

const {
  startExportRecords: startExportRecordsFromRemoteServer,
  downloadExportedRecordsFile: downloadExportedRecordsFileFromRemoteServer,
  uploadRecords: uploadRecordsToRemoteServer,
} = RecordRemoteService;

const fetchRecordsSummariesRemote = async ({ surveyRemoteId, cycle }) => {
  try {
    const { data } = await RemoteService.get(
      `api/survey/${surveyRemoteId}/records/summary`,
      { cycle }
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
  const { cycle } = recordSummaryLocal;
  const keyDefs = SurveyDefs.getRootKeyDefs({ survey, cycle });
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

const syncRecordSummaries = async ({ survey, cycle }) => {
  const { id: surveyId } = survey;

  const recordsSummariesInDevice = await fetchRecords({
    survey,
    cycle,
    onlyLocal: false,
  });
  const recordsSummariesRemote = await fetchRecordsSummariesRemote({
    surveyRemoteId: survey.remoteId,
    cycle,
  });

  const recordsSummariesLocalToDelete = recordsSummariesInDevice.filter(
    (recordSummaryLocal) =>
      // record summary is not locally modified and is no more in server
      recordSummaryLocal.origin === RecordOrigin.remote &&
      recordSummaryLocal.loadStatus === RecordLoadStatus.summary &&
      !ArrayUtils.findByUuid(recordSummaryLocal.uuid)(recordsSummariesRemote)
  );
  if (recordsSummariesLocalToDelete.length > 0) {
    deleteRecords({
      surveyId,
      recordUuids: recordsSummariesLocalToDelete.map((record) => record.uuid),
    });
  }

  const recordSummariesToAdd = recordsSummariesRemote.filter(
    (recordSummaryRemote) =>
      !ArrayUtils.findByUuid(recordSummaryRemote.uuid)(recordsSummariesInDevice)
  );
  if (recordSummariesToAdd.length > 0) {
    insertRecordSummaries({
      survey,
      cycle,
      recordSummaries: recordSummariesToAdd,
    });
  }

  const recordsSummariesLocalReloaded = await fetchRecords({
    survey,
    cycle,
    onlyLocal: true,
  });

  return recordsSummariesLocalReloaded.map((recordSummaryLocal) => {
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
  syncRecordSummaries,
  findRecordIdsByKeys,
  insertRecord,
  updateRecord,
  updateRecordWithContentFetchedRemotely,
  deleteRecords,
  fixRecordCycle,
  // remote server
  startExportRecordsFromRemoteServer,
  downloadExportedRecordsFileFromRemoteServer,
  uploadRecordsToRemoteServer,
};
