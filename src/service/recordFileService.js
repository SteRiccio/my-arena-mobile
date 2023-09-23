import { RecordFileRepository } from "./repository/recordFileRepository";

const { getRecordFileUri, saveRecordFile, deleteRecordFile } =
  RecordFileRepository;

export const RecordFileService = {
  getRecordFileUri,
  saveRecordFile,
  deleteRecordFile,
};
