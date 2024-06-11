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
  fetchRecordsWithEmptyCycle,
  insertRecord,
  insertRecordSummaries,
  updateRecord,
  updateRecordWithContentFetchedRemotely,
  updateRecordsDateSync,
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

const toDate = (dateStr) => (dateStr ? new Date(dateStr) : null);

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

  const dateModifiedLocal = toDate(recordSummaryLocal.dateModified);
  const dateSynced = toDate(recordSummaryLocal.dateSynced);
  const dateModifiedRemote = recordSummaryRemote
    ? Dates.parseISO(recordSummaryRemote.dateModified)
    : null;

  if (recordSummaryLocal.origin === RecordOrigin.local) {
    if (!keysSpecified) {
      return RecordSyncStatus.keysNotSpecified;
    }
    if (!recordSummaryRemote) {
      return RecordSyncStatus.new;
    }
    if (recordSummaryRemote.step > 1) {
      return RecordSyncStatus.notInEntryStepAnymore;
    }
    if (Dates.isAfter(dateModifiedLocal, dateModifiedRemote)) {
      return RecordSyncStatus.modifiedLocally;
    } else if (Dates.isBefore(dateModifiedLocal, dateModifiedRemote)) {
      return RecordSyncStatus.modifiedRemotely;
    }
    return RecordSyncStatus.notModified;
  } else if (recordSummaryLocal.loadStatus !== RecordLoadStatus.summary) {
    if (Dates.isBefore(dateSynced, dateModifiedRemote)) {
      return RecordSyncStatus.notUpToDate;
    }
  }
  return RecordSyncStatus.syncNotApplicable;
};

const syncRecordSummaries = async ({ survey, cycle, onlyLocal }) => {
  const { id: surveyId } = survey;

  const allRecordsSummariesInDevice = await fetchRecords({
    survey,
    cycle,
    onlyLocal: false,
  });

  const recordsSummariesRemote = await fetchRecordsSummariesRemote({
    surveyRemoteId: survey.remoteId,
    cycle,
  });

  const recordsSummariesLocalToDelete = allRecordsSummariesInDevice.filter(
    (recordSummaryLocal) =>
      // record summary is not locally modified and is no more in server
      recordSummaryLocal.origin === RecordOrigin.remote &&
      recordSummaryLocal.loadStatus === RecordLoadStatus.summary &&
      !ArrayUtils.findByUuid(recordSummaryLocal.uuid)(recordsSummariesRemote)
  );
  if (recordsSummariesLocalToDelete.length > 0) {
    await deleteRecords({
      surveyId,
      recordUuids: recordsSummariesLocalToDelete.map((record) => record.uuid),
    });
  }

  const recordSummariesToAdd = recordsSummariesRemote.filter(
    (recordSummaryRemote) =>
      // remote records not in local db
      !ArrayUtils.findByUuid(recordSummaryRemote.uuid)(
        allRecordsSummariesInDevice
      )
  );
  if (recordSummariesToAdd.length > 0) {
    await insertRecordSummaries({
      survey,
      cycle,
      recordSummaries: recordSummariesToAdd,
    });
  }

  for await (const recordSummaryLocal of allRecordsSummariesInDevice) {
    const { origin, loadStatus, uuid } = recordSummaryLocal;
    const recordSummaryRemote = ArrayUtils.findByUuid(uuid)(
      recordsSummariesRemote
    );
    if (
      origin === RecordOrigin.remote &&
      loadStatus === RecordLoadStatus.summary &&
      recordSummaryRemote
    ) {
      await RecordRepository.updateRecordKeysAndDateModifiedWithSummaryFetchedRemotely(
        { survey, recordSummary: recordSummaryRemote }
      );
    }
  }

  const recordsSummariesLocalReloaded = await fetchRecords({
    survey,
    cycle,
    onlyLocal,
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

const findRecordIdsByKeys = async ({
  survey,
  cycle,
  keyValues,
  keyValuesFormatted,
}) => {
  let recordIds = await RecordRepository.findRecordIdsByKeys({
    survey,
    cycle,
    keyValues,
  });
  if (recordIds.length === 0) {
    // try to fetch records using formatted keys
    recordIds = await RecordRepository.findRecordIdsByKeys({
      survey,
      cycle,
      keyValues: keyValuesFormatted,
    });
  }
  return recordIds;
};

export const RecordService = {
  fetchRecord,
  fetchRecords,
  syncRecordSummaries,
  fetchRecordsWithEmptyCycle,
  findRecordIdsByKeys,
  insertRecord,
  updateRecord,
  updateRecordWithContentFetchedRemotely,
  updateRecordsDateSync,
  deleteRecords,
  fixRecordCycle,
  // remote server
  startExportRecordsFromRemoteServer,
  downloadExportedRecordsFileFromRemoteServer,
  uploadRecordsToRemoteServer,
};