import { JobStatus } from "@openforis/arena-core";

import { BackupJob } from "./backupJob/BackupJob";
import { RecordFileRepository } from "./repository/recordFileRepository";
import { SurveyFSRepository } from "./repository/surveyFSRepository";
import { Files } from "utils";
import { dbClient } from "db";

const getDbUri = () =>
  Files.path(Files.documentDirectory, "SQLite", dbClient?.name);

const estimateFullBackupSize = async () => {
  const recordFilesSize =
    await RecordFileRepository.getRecordFilesParentDirectorySize();
  const surveysSize = await SurveyFSRepository.getStorageSize();
  const dbSize = await Files.getSize(getDbUri());
  const size = dbSize + surveysSize + recordFilesSize;
  console.log("===size", size);
  return size;
};

const generateFullBackup = async () => {
  const job = new BackupJob({ user: {} });
  await job.start();

  const { status, result } = job.summary;
  switch (status) {
    case JobStatus.succeeded:
      return result.outputFileUri;
    case JobStatus.failed:
      throw new Error(JSON.stringify(job.summary.errors));
    default:
      return null;
  }
};

export const AppService = {
  estimateFullBackupSize,
  generateFullBackup,
};
