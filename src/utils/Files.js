import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

const DOWNLOAD_FOLDER = "Download";

const MIME_TYPES = {
  zip: "application/zip ",
};

const getFreeDiskStorage = async () => FileSystem.getFreeDiskStorageAsync();

const jsonToString = (obj) => JSON.stringify(obj, null, 2);

const getInfo = async (fileUri) => FileSystem.getInfoAsync(fileUri);

const getSize = async (fileUri, ignoreErrors = true) => {
  try {
    return (await getInfo(fileUri)).size;
  } catch (error) {
    if (ignoreErrors) return -1;
    throw error;
  }
};

const readJsonFromFile = async ({ fileUri }) => {
  const content = await FileSystem.readAsStringAsync(fileUri);
  return JSON.parse(content);
};

const moveFileToDownloadFolder = async (fileUri) => {
  const permissionsResponse = await MediaLibrary.requestPermissionsAsync(true);
  if (!permissionsResponse.granted) {
    return false;
  }

  const asset = await MediaLibrary.createAssetAsync(fileUri);
  const album = await MediaLibrary.getAlbumAsync(DOWNLOAD_FOLDER);
  if (album == null) {
    await MediaLibrary.createAlbumAsync(DOWNLOAD_FOLDER, asset, false);
  } else {
    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
  }
  return true;
};

const writeStringToFile = async ({ content, fileUri }) =>
  FileSystem.writeAsStringAsync(fileUri, content);

const writeJsonToFile = async ({ content, fileUri }) =>
  writeStringToFile({ content: jsonToString(content), fileUri });

const isSharingAvailable = async () => Sharing.isAvailableAsync();

const shareFile = async ({ url, mimeType, dialogTitle }) => {
  await Sharing.shareAsync(url, { mimeType, dialogTitle });
};

const toHumanReadableFileSize = (
  bytes,
  { si = true, decimalPlaces = 1 } = {}
) => {
  const threshold = si ? 1000 : 1024;

  if (Math.abs(bytes) < threshold) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let unitIndex = -1;
  const ratio = 10 ** decimalPlaces;

  do {
    bytes /= threshold;
    ++unitIndex;
  } while (
    Math.round(Math.abs(bytes) * ratio) / ratio >= threshold &&
    unitIndex < units.length - 1
  );

  return bytes.toFixed(decimalPlaces) + " " + units[unitIndex];
};

export const Files = {
  MIME_TYPES,
  getFreeDiskStorage,
  getInfo,
  getSize,
  readJsonFromFile,
  isSharingAvailable,
  shareFile,
  moveFileToDownloadFolder,
  writeJsonToFile,
  writeStringToFile,
  toHumanReadableFileSize,
};
