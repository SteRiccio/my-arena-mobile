import { zip } from "react-native-zip-archive";
import * as FileSystem from "expo-file-system";

import {
  Dates,
  JobBase,
  JobStatus,
  Promises,
  UUIDs,
} from "@openforis/arena-core";

import { JobMobile } from "model";

import { RecordService } from "./recordService";
import { RecordFileService } from "./recordFileService";

const RECORDS_FOLDER_NAME = "records";
const RECORDS_SUMMARY_JSON_FILENAME = "records.json";

const toJson = (obj) => JSON.stringify(obj, null, 2);

export class RecordsExportJob extends JobMobile {
  constructor({ survey, recordUuids, user }) {
    super({ survey, recordUuids, user });
  }

  async execute() {
    const { survey, recordUuids } = this.context;

    const tempFolderUri = `${FileSystem.cacheDirectory}${UUIDs.v4()}`;

    try {
      const tempRecordsFolderUri = `${tempFolderUri}/${RECORDS_FOLDER_NAME}`;

      await FileSystem.makeDirectoryAsync(tempRecordsFolderUri, {
        intermediates: true,
      });

      const recordsSummary = await RecordService.fetchRecords({ survey });

      const recordsToExport = recordsSummary.filter((recordSummary) =>
        recordUuids.includes(recordSummary.uuid)
      );
      const recordsSummaryJson = toJson(
        recordsToExport.map(({ uuid, cycle }) => ({ uuid, cycle }))
      );

      const tempRecordsSummaryJsonFileUri = `${tempRecordsFolderUri}/${RECORDS_SUMMARY_JSON_FILENAME}`;
      await FileSystem.writeAsStringAsync(
        tempRecordsSummaryJsonFileUri,
        recordsSummaryJson
      );

      await Promises.each(recordsToExport, async (recordSummary) => {
        const { id: recordId, uuid } = recordSummary;
        const record = await RecordService.fetchRecord({ survey, recordId });
        const tempRecordFileUri = `${tempRecordsFolderUri}/${uuid}.json`;
        await FileSystem.writeAsStringAsync(tempRecordFileUri, toJson(record));
        this.incrementProcessedItems();
      });

      const outputFileName = `recordsExport-${Dates.nowFormattedForStorage()}.zip`;
      this.outputFileUri = `${FileSystem.documentDirectory}${outputFileName}`;

      await zip(tempFolderUri, this.outputFileUri);
    } finally {
      await FileSystem.deleteAsync(tempFolderUri);
    }
  }

  async prepareResult() {
    const { outputFileUri } = this;
    return { outputFileUri };
  }
}
