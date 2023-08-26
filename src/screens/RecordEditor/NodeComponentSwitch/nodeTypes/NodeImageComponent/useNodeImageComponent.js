import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";

import { UUIDs } from "@openforis/arena-core";

import {
  useRequestCameraPermission,
  useRequestMediaLibraryPermission,
  useToast,
} from "hooks";

import { SurveySelectors } from "state/survey";
import { ConfirmActions } from "state/confirm";
import { RecordFileService } from "service/recordFileService";

import { useNodeComponentLocalState } from "screens/RecordEditor/useNodeComponentLocalState";
import { ImageUtils } from "./imageUtils";
import { Files } from "utils";

export const useNodeImageComponent = ({ nodeDef, nodeUuid }) => {
  const dispatch = useDispatch();

  const toaster = useToast();

  const { request: requestCameraPermission } = useRequestCameraPermission();

  const { request: requestMediaLibraryPermission } =
    useRequestMediaLibraryPermission();

  const survey = SurveySelectors.useCurrentSurvey();
  const surveyId = survey.id;

  const maxSize = (nodeDef.props.maxSize ?? 10) * Math.pow(1024, 2); // max size is in MB

  const { value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const { fileUuid } = value || {};

  const [pickedImageUri, setPickedImageUri] = useState(null);

  useEffect(() => {
    const fileUri = fileUuid
      ? RecordFileService.getRecordFileUri({ surveyId, fileUuid })
      : null;
    if (fileUri !== pickedImageUri) {
      setPickedImageUri(fileUri);
    }
  }, [pickedImageUri, value]);

  const onImageSelected = useCallback(
    async (result) => {
      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset) return;

      const sourceFileUri = asset.uri;
      setPickedImageUri(sourceFileUri);

      const fileName = sourceFileUri.substring(
        sourceFileUri.lastIndexOf("/") + 1
      );
      const { size: sourceFileSize } = await Files.getInfo(sourceFileUri);
      let fileUri = sourceFileUri;
      let fileSize = sourceFileSize;

      if (sourceFileSize > maxSize) {
        // resize image
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
      }
      const valueUpdated = { fileUuid: UUIDs.v4(), fileName, fileSize };
      await updateNodeValue(valueUpdated, fileUri);
    },
    [fileUuid, maxSize]
  );

  const openImageLibrary = useCallback(async () => {
    if (!(await requestMediaLibraryPermission())) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    onImageSelected(result);
  }, [onImageSelected, requestMediaLibraryPermission]);

  const onPictureChoosePress = useCallback(async () => {
    if (pickedImageUri) {
      dispatch(
        ConfirmActions.show({
          messageKey: "dataEntry:pictureDeleteAndTakeNewOneConfirmMessage",
          onConfirm: openImageLibrary,
        })
      );
    } else {
      openImageLibrary();
    }
  }, [openImageLibrary, pickedImageUri]);

  const openCamera = useCallback(async () => {
    if (!(await requestCameraPermission())) return;

    const result = await ImagePicker.launchCameraAsync();
    onImageSelected(result);
  }, [onImageSelected, requestCameraPermission]);

  const onOpenCameraPress = useCallback(async () => {
    if (pickedImageUri) {
      dispatch(
        ConfirmActions.show({
          messageKey:
            "dataEntry:fileAttributeImage.pictureDeleteAndTakeNewOneConfirmMessage",
          onConfirm: openCamera,
        })
      );
    } else {
      await openCamera();
    }
  }, [openCamera, pickedImageUri]);

  const onDeletePress = useCallback(async () => {
    dispatch(
      ConfirmActions.show({
        messageKey: "dataEntry:fileAttributeImage.pictureDeleteConfirmMessage",
        onConfirm: async () => {
          await updateNodeValue(null);
        },
      })
    );
  }, [updateNodeValue]);

  return {
    onDeletePress,
    onOpenCameraPress,
    onPictureChoosePress,
    pickedImageUri,
  };
};
