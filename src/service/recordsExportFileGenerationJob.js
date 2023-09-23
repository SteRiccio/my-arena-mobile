import { zip } from "react-native-zip-archive";
import * as FileSystem from "expo-file-system";

import {
  Dates,
  NodeDefType,
  NodeDefs,
  Objects,
  Promises,
  Records,
  UUIDs,
} from "@openforis/arena-core";

import { JobMobile } from "model";
import { Files } from "utils/Files";

import { RecordService } from "./recordService";
import { RecordFileService } from "./recordFileService";

const RECORDS_FOLDER_NAME = "records";
const RECORDS_SUMMARY_JSON_FILENAME = "records.json";
const FILES_FOLDER_NAME = "files";
const FILES_SUMMARY_JSON_FILENAME = "files.json";

export class RecordsExportFileGenerationJob extends JobMobile {
  constructor({ survey, recordUuids, user }) {
    super({ survey, recordUuids, user });
  }

  async execute() {
    const { survey, recordUuids, user } = this.context;

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

      // set total
      this.summary.total = recordsToExport.length;

      const tempRecordsSummaryJsonFileUri = `${tempRecordsFolderUri}/${RECORDS_SUMMARY_JSON_FILENAME}`;
      await Files.writeJsonToFile({
        content: recordsToExport.map(({ uuid, cycle }) => ({ uuid, cycle })),
        fileUri: tempRecordsSummaryJsonFileUri,
      });

      const nodeDefsFile = Object.values(survey.nodeDefs).filter(
        (nodeDef) => NodeDefs.getType(nodeDef) === NodeDefType.file
      );

      const files = [];

      await Promises.each(recordsToExport, async (recordSummary) => {
        const { id: recordId, uuid } = recordSummary;
        const record = await RecordService.fetchRecord({ survey, recordId });
        if (!record.ownerUuid) {
          record.ownerUuid = user.uuid;
        }

        const tempRecordFileUri = `${tempRecordsFolderUri}/${uuid}.json`;
        await Files.writeJsonToFile({
          content: record,
          fileUri: tempRecordFileUri,
        });

        if (!Objects.isEmpty(nodeDefsFile)) {
          const { recordFiles } = await this.writeRecordFiles({
            tempFolderUri,
            nodeDefsFile,
            record,
          });

          files.push(...recordFiles);
        }

        this.incrementProcessedItems();
      });

      if (files.length > 0) {
        const tempFilesSummaryJsonFileUri = `${tempFolderUri}/${FILES_FOLDER_NAME}/${FILES_SUMMARY_JSON_FILENAME}`;
        await Files.writeJsonToFile({
          content: files,
          fileUri: tempFilesSummaryJsonFileUri,
        });
      }

      const outputFileName = `recordsExport-${Dates.nowFormattedForStorage()}.zip`;
      this.outputFileUri = `${FileSystem.documentDirectory}${outputFileName}`;

      await zip(tempFolderUri, this.outputFileUri);
    } finally {
      await FileSystem.deleteAsync(tempFolderUri);
    }
  }

  async writeRecordFiles({ tempFolderUri, nodeDefsFile, record }) {
    const { survey } = this.context;
    const surveyId = survey.id;

    const nodesFile = nodeDefsFile.reduce((acc, nodeDefFile) => {
      const nodeDefFileUuid = nodeDefFile.uuid;
      acc.push(...Records.getNodesByDefUuid(nodeDefFileUuid)(record));
      return acc;
    }, []);

    const recordFiles = nodesFile.reduce((acc, nodeFile) => {
      if (!nodeFile.value) return acc;

      const { fileName: name, fileSize: size, fileUuid } = nodeFile.value;

      acc.push({
        uuid: fileUuid,
        props: {
          name,
          size,
          nodeUuid: nodeFile.uuid,
          recordUuid: record.uuid,
        },
      });
      return acc;
    }, []);

    await Promises.each(recordFiles, async (recordFile) => {
      const { uuid: fileUuid } = recordFile;
      const fileUri = RecordFileService.getRecordFileUri({
        surveyId,
        fileUuid,
      });
      const info = await FileSystem.getInfoAsync(fileUri);
      if (info.exists) {
        const destUri = `${tempFolderUri}/${FILES_FOLDER_NAME}/${fileUuid}.bin`;
        await FileSystem.copyAsync({
          from: fileUri,
          to: destUri,
        });
      }
    });

    return {
      recordFiles,
    };
  }

  async prepareResult() {
    const { outputFileUri } = this;
    return { outputFileUri };
  }
}
