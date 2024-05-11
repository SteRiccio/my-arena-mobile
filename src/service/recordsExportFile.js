import { Files } from "utils/Files";

const recordsFolderPath = "records";
const recordsSummaryJsonPath = Files.path(recordsFolderPath, "records.json");

const getRecordContentJsonPath = (recordUuid) =>
  Files.path(recordsFolderPath, recordUuid + ".json");

export const RecordsExportFile = {
  recordsFolderPath,
  recordsSummaryJsonPath,
  getRecordContentJsonPath,
};
