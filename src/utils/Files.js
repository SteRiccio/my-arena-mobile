import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import mime from "mime";

import { Promises, Strings, UUIDs } from "@openforis/arena-core";

const PATH_SEPARATOR = "/";
const DOWNLOAD_FOLDER = "Download";
const TEMP_FOLDER_NAME = "mam_temp";

const MIME_TYPES = {
  zip: "application/zip ",
};

const { cacheDirectory, documentDirectory, readDirectoryAsync } = FileSystem;

const path = (...parts) =>
  parts.map(Strings.removeSuffix(PATH_SEPARATOR)).join(PATH_SEPARATOR);

const getTempFolderParentUri = () => path(cacheDirectory, TEMP_FOLDER_NAME);

const createTempFolder = async () => {
  const uri = path(getTempFolderParentUri(), UUIDs.v4());
  await mkDir(uri);
  return uri;
};

const mkDir = async (dir) =>
  FileSystem.makeDirectoryAsync(dir, {
    intermediates: true,
  });

const listDir = async (dirUri) => {
  try {
    const fileNames = await FileSystem.readDirectoryAsync(dirUri);
    return fileNames.map((fileName) => path(dirUri, fileName));
  } catch (error) {
    return [];
  }
};

const visitDirFilesRecursively = async ({
  dirUri,
  visitor,
  visitDirectories = false,
}) => {
  const stack = [dirUri];
  while (stack.length > 0) {
    const currentDirUri = stack.pop();
    const fileUris = await listDir(currentDirUri);
    await Promises.each(fileUris, async (fileUri) => {
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

const getNameFromUri = (uri) => uri.substring(uri.lastIndexOf("/") + 1);

const getExtension = (uri) => {
  const indexOfDot = uri.lastIndexOf(".");
  return indexOfDot < 0 || indexOfDot === uri.length
    ? ""
    : uri.substring(indexOfDot + 1);
};

const getMimeTypeFromUri = (uri) => {
  const fileName = getNameFromUri(uri);
  return getMimeTypeFromName(fileName);
};

const getMimeTypeFromName = (fileName) => mime.getType(fileName);

const readJsonFromFile = async ({ fileUri }) => {
  const content = await FileSystem.readAsStringAsync(fileUri);
  return JSON.parse(content);
};

const listDirectory = async (fileUri) => {
  try {
    return readDirectoryAsync(fileUri);
  } catch (e) {
    // ignore it
    return [];
  }
};

const copyFile = async ({ from, to }) => FileSystem.copyAsync({ from, to });

const moveFile = async ({ from, to }) => FileSystem.moveAsync({ from, to });

const del = async (fileUri, ignoreErrors = false) =>
  FileSystem.deleteAsync(fileUri, { idempotent: ignoreErrors });

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

const shareFile = async ({
  url,
  mimeType: mimeTypeParam = null,
  dialogTitle,
}) => {
  const mimeType = mimeTypeParam ?? getMimeTypeFromUri(url);
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
  getTempFolderParentUri,
  createTempFolder,
  mkDir,
  del,
  visitDirFilesRecursively,
  getDirSize,
  getFreeDiskStorage,
  getInfo,
  getMimeTypeFromName,
  getMimeTypeFromUri,
  getNameFromUri,
  getExtension,
  getSize,
  readJsonFromFile,
  listDirectory,
  isSharingAvailable,
  shareFile,
  copyFile,
  moveFile,
  moveFileToDownloadFolder,
  writeJsonToFile,
  writeStringToFile,
  toHumanReadableFileSize,
};
