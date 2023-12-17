import { RecordFileRepository } from "./repository/recordFileRepository";

const {
  getRecordFilesParentDirectorySize,
  getRecordFilesDirectorySize,
  getRecordFileUri,
  saveRecordFile,
  deleteRecordFile,
} = RecordFileRepository;

export const RecordFileService = {
  getRecordFilesParentDirectorySize,
  getRecordFilesDirectorySize,
  getRecordFileUri,
  saveRecordFile,
  deleteRecordFile,
};
