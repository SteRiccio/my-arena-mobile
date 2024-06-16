import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import { NodeDefFileType, UUIDs } from "@openforis/arena-core";

import {
  useRequestCameraPermission,
  useRequestMediaLibraryPermission,
  useToast,
} from "hooks";

import { SurveySelectors } from "state/survey";
import { ConfirmActions } from "state/confirm";
import { RecordFileService } from "service/recordFileService";

import { useNodeComponentLocalState } from "screens/RecordEditor/useNodeComponentLocalState";
import { Files } from "utils";
import { ImageUtils } from "../../../../../utils/ImageUtils";

const mediaTypesByFileType = {
  [NodeDefFileType.image]: ImagePicker.MediaTypeOptions.Images,
  [NodeDefFileType.video]: ImagePicker.MediaTypeOptions.Videos,
};

export const useNodeFileComponent = ({ nodeDef, nodeUuid }) => {
  const dispatch = useDispatch();

  const toaster = useToast();

  const { request: requestCameraPermission } = useRequestCameraPermission();

  const { request: requestMediaLibraryPermission } =
    useRequestMediaLibraryPermission();

  const survey = SurveySelectors.useCurrentSurvey();
  const surveyId = survey.id;

  const { fileType = NodeDefFileType.other, maxSize: maxSizeMB = 10 } =
    nodeDef.props;
  const maxSize = maxSizeMB * Math.pow(1024, 2); // nodeDef maxSize is in MB

  const mediaTypes =
    mediaTypesByFileType[fileType] ?? ImagePicker.MediaTypeOptions.All;

  const { value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const { fileName, fileUuid } = value || {};

  const [pickedFileUri, setPickedFileUri] = useState(null);
  const [resizing, setResizing] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

  useEffect(() => {
    const fileUri = fileUuid
      ? RecordFileService.getRecordFileUri({ surveyId, fileUuid })
      : null;
    if (fileUri !== pickedFileUri) {
      setPickedFileUri(fileUri);
    }
  }, [pickedFileUri, fileUuid]);

  const onFileSelected = useCallback(
    async (result) => {
      const { assets, canceled } = result;
      if (canceled) return;

      const asset = assets?.[0];
      if (!asset) return;

      const { name: assetFileName, uri: sourceFileUri } = asset;

      const fileName = assetFileName ?? Files.getNameFromUri(sourceFileUri);

      const { size: sourceFileSize } = await Files.getInfo(sourceFileUri);

      let fileUri = sourceFileUri;
      let fileSize = sourceFileSize;

      if (fileType === NodeDefFileType.image && sourceFileSize > maxSize) {
        // resize image
        setResizing(true);
        const {
          error,
          uri: resizedFileUri,
          size: resizedFileSize,
        } = (await ImageUtils.resizeToFitMaxSize({
          fileUri: sourceFileUri,
          maxSize,
        })) || {};

        if (!error && resizedFileUri) {
          fileUri = resizedFileUri;
          fileSize = resizedFileSize;

          toaster.show("dataEntry:fileAttributeImage.pictureResizedToSize", {
            size: Files.toHumanReadableFileSize(resizedFileSize),
          });
        }
        setResizing(false);
      }
      setPickedFileUri(fileUri);
      const valueUpdated = { fileUuid: UUIDs.v4(), fileName, fileSize };
      await updateNodeValue(valueUpdated, fileUri);
    },
    [maxSize]
  );

  const onFileChoosePress = useCallback(async () => {
    if (!(await requestMediaLibraryPermission())) return;

    const result =
      fileType === NodeDefFileType.other
        ? await DocumentPicker.getDocumentAsync()
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
            mediaTypes,
          });
    onFileSelected(result);
  }, [onFileSelected, requestMediaLibraryPermission, mediaTypes]);

  const onFileOpenPress = useCallback(async () => {
    const mimeType = Files.getMimeTypeFromName(fileName);
    await Files.shareFile({ url: pickedFileUri, mimeType });
  }, [fileName, pickedFileUri]);

  const onOpenCameraPress = useCallback(async () => {
    if (!(await requestCameraPermission())) return;

    const result = await ImagePicker.launchCameraAsync({ mediaTypes });
    onFileSelected(result);
  }, [onFileSelected, requestCameraPermission, mediaTypes]);

  const onDeletePress = useCallback(async () => {
    dispatch(
      ConfirmActions.show({
        messageKey: "dataEntry:fileAttribute.deleteConfirmMessage",
        onConfirm: async () => {
          await updateNodeValue(null);
        },
      })
    );
  }, [updateNodeValue]);

  const onImagePreviewPress = useCallback(() => {
    setImagePreviewOpen(true);
  }, []);

  const closeImagePreview = useCallback(() => {
    setImagePreviewOpen(false);
  }, []);

  return {
    closeImagePreview,
    fileName,
    imagePreviewOpen,
    onDeletePress,
    onOpenCameraPress,
    onFileChoosePress,
    onFileOpenPress,
    onImagePreviewPress,
    pickedFileUri,
    resizing,
  };
};
