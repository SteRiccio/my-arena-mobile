import * as FileSystem from "expo-file-system";

const getDirUri = (subFolder) => `${FileSystem.documentDirectory}${subFolder}`;

const makeDirIfNotExists = async (dirUri) => {
  const dirInfo = await FileSystem.getInfoAsync(dirUri);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
  }
};
const moveFile = async ({ from, to }) => FileSystem.moveAsync({ from, to });

const deleteFile = async (fileUri) => {
  await FileSystem.deleteAsync(fileUri);
};

export const GenericFileRepository = {
  getDirUri,
  makeDirIfNotExists,
  deleteFile,
  moveFile,
};
