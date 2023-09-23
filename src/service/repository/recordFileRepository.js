import { GenericFileRepository } from "./genericFileRepository";

const SURVEY_RECORD_FILES_DIR_NAME = "survey_record_files";

const getRecordFileDirectoryUri = ({ surveyId }) =>
  `${GenericFileRepository.getDirUri(
    SURVEY_RECORD_FILES_DIR_NAME
  )}/${surveyId}`;

const getRecordFileUri = ({ surveyId, fileUuid }) =>
  `${getRecordFileDirectoryUri({ surveyId })}/${fileUuid}`;

const saveRecordFile = async ({ surveyId, fileUuid, sourceFileUri }) => {
  await GenericFileRepository.makeDirIfNotExists(
    getRecordFileDirectoryUri({ surveyId })
  );

  const fileUriTarget = getRecordFileUri({ surveyId, fileUuid });

  await GenericFileRepository.moveFile({
    from: sourceFileUri,
    to: fileUriTarget,
  });
};

const deleteRecordFile = async ({ surveyId, fileUuid }) => {
  const fileUri = getRecordFileUri({ surveyId, fileUuid });
  await GenericFileRepository.deleteFile(fileUri);
};

export const RecordFileRepository = {
  getRecordFileUri,
  saveRecordFile,
  deleteRecordFile,
};
