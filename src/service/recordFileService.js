import * as FileSystem from "expo-file-system";

const SURVEY_RECORD_FILES_DIR_NAME = "survey_record_files";

const makeDirIfNotExists = async (dirUri) => {
  const dirInfo = await FileSystem.getInfoAsync(dirUri);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
  }
};

const getRecordFileDirectoryUri = ({ surveyId }) => {
  const dirUri = `${FileSystem.documentDirectory}${SURVEY_RECORD_FILES_DIR_NAME}/${surveyId}`;
  return dirUri;
};

const getRecordFileUri = ({ surveyId, fileUuid }) =>
  `${getRecordFileDirectoryUri({ surveyId })}/${fileUuid}`;

const saveRecordFile = async ({ surveyId, fileUuid, sourceFileUri }) => {
  await makeDirIfNotExists(getRecordFileDirectoryUri({ surveyId }));

  const fileUriTarget = getRecordFileUri({ surveyId, fileUuid });

  await FileSystem.moveAsync({ from: sourceFileUri, to: fileUriTarget });
};

const deleteRecordFile = async ({ surveyId, fileUuid }) => {
  const fileUri = getRecordFileUri({ surveyId, fileUuid });
  await FileSystem.deleteAsync(fileUri);
};

export const RecordFileService = {
  getRecordFileUri,
  saveRecordFile,
  deleteRecordFile,
};
