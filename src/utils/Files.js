import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

import { Promises, Strings, UUIDs } from "@openforis/arena-core";

const DOWNLOAD_FOLDER = "Download";
const TEMP_FOLDER_NAME = "mam_temp";

const MIME_TYPES = {
  zip: "application/zip ",
};

const { cacheDirectory, documentDirectory, deleteAsync: del } = FileSystem;

const path = (...parts) =>
  parts.map(Strings.removeSuffix(PATH_SEPARATOR)).join(PATH_SEPARATOR);

const getTempFolderParentUri = () => path(cacheDirectory, TEMP_FOLDER_NAME);

const createTempFolder = () => path(getTempFolderParentUri(), UUIDs.v4());

const mkDir = async (dir) =>
  FileSystem.makeDirectoryAsync(dir, {
    intermediates: true,
  });

const visitDirFilesRecursively = async ({
  dirUri,
  visitor,
  visitDirectories = false,
}) => {
  const stack = [dirUri];
  while (stack.length > 0) {
    const currentDirUri = stack.pop();
    const dirFileNames = await FileSystem.readDirectoryAsync(currentDirUri);
    await Promises.each(dirFileNames, async (fileName) => {
      const fileUri = path(currentDirUri, fileName);
      const info = await getInfo(fileUri);
      if (info) {
        if (!info.isDirectory || visitDirectories) {
          await visitor(fileUri);
        }
        if (info.isDirectory) {
          stack.push(fileUri);
        }
      }
    });
  }
};

const getDirSize = async (dirUri) => {
  let total = 0;
  await visitDirFilesRecursively({
    dirUri,
    visitor: async (fileUri) => {
      const size = await getSize(fileUri);
      total += size;
    },
  });
  return total;
};

const getFreeDiskStorage = async () => FileSystem.getFreeDiskStorageAsync();

const jsonToString = (obj) => JSON.stringify(obj, null, 2);

const getInfo = async (fileUri, ignoreErrors = true) => {
  try {
    const info = await FileSystem.getInfoAsync(fileUri);
    return info;
  } catch (error) {
    if (ignoreErrors) {
      return null;
    }
    throw error;
  }
};

const getSize = async (fileUri, ignoreErrors = true) => {
  const info = await getInfo(fileUri, ignoreErrors);
  return info?.size ?? 0;
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
  cacheDirectory,
  documentDirectory,
  path,
  createTempFolder,
  mkDir,
  del,
  visitDirFilesRecursively,
  getDirSize,
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
