import { zip } from "react-native-zip-archive";
import * as FileSystem from "expo-file-system";

import {
  Dates,
  JobBase,
  JobStatus,
  Promises,
  UUIDs,
} from "@openforis/arena-core";
import { RecordService } from "./recordService";
import { RecordFileService } from "./recordFileService";

const RECORDS_FOLDER_NAME = "records";
const RECORDS_SUMMARY_JSON_FILENAME = "records.json";

const toJson = (obj) => JSON.stringify(obj, null, 2);

export class RecordsExportJob extends JobBase {
  constructor({ survey, recordUuids, user }) {
    super({ survey, recordUuids, user });
  }

  async execute() {
    const { survey, recordUuids } = this.context;

    const tempFolderPath = `${FileSystem.cacheDirectory}${UUIDs.v4()}`;

    try {
      const tempRecordsFolderPath = `${tempFolderPath}/${RECORDS_FOLDER_NAME}`;

      await FileSystem.makeDirectoryAsync(tempRecordsFolderPath, {
        intermediates: true,
      });

      const recordsSummary = await RecordService.fetchRecords({ survey });

      const recordsToExport = recordsSummary.filter((recordSummary) =>
        recordUuids.includes(recordSummary.uuid)
      );
      const recordsSummaryJson = toJson(
        recordsToExport.map(({ uuid, cycle }) => ({ uuid, cycle }))
      );

      const tempRecordsSummaryJsonFilePath = `${tempRecordsFolderPath}/${RECORDS_SUMMARY_JSON_FILENAME}`;
      await FileSystem.writeAsStringAsync(
        tempRecordsSummaryJsonFilePath,
        recordsSummaryJson
      );

      await Promises.each(recordsToExport, async (recordSummary) => {
        const { id: recordId, uuid } = recordSummary;
        const record = await RecordService.fetchRecord({ survey, recordId });
        const tempRecordFilePath = `${tempRecordsFolderPath}/${uuid}.json`;
        await FileSystem.writeAsStringAsync(tempRecordFilePath, toJson(record));
        this.incrementProcessedItems();
      });

      const outputFileName = `recordsExport-${Dates.nowFormattedForStorage()}.zip`;
      this.outputFilePath = `${FileSystem.documentDirectory}${outputFileName}`;

      await zip(tempFolderPath, this.outputFilePath);
    } finally {
      await FileSystem.deleteAsync(tempFolderPath);
    }
  }

  async prepareResult() {
    const { outputFilePath } = this;
    if (this.summary.status === JobStatus.succeeded) {
      return {
        outputFilePath,
      };
    } else {
      return null;
    }
  }

  createLogger() {
    const log = (message) => console.log(message);
    return {
      debug: (message) => log(message),
      error: (message) => log(message),
      warning: (message) => log(message),
    };
  }
}
