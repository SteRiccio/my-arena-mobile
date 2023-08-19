import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

const DOWNLOAD_FOLDER = "Download";

const MIME_TYPES = {
  zip: "application/zip ",
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

const isSharingAvailable = async () => Sharing.isAvailableAsync();

const shareFile = async ({ url, mimeType, dialogTitle }) => {
  await Sharing.shareAsync(url, { mimeType, dialogTitle });
};

export const Files = {
  MIME_TYPES,
  isSharingAvailable,
  shareFile,
  moveFileToDownloadFolder,
};
