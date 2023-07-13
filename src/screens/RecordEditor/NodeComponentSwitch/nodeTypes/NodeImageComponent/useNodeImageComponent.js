import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { UUIDs } from "@openforis/arena-core";

import {
  useRequestCameraPermission,
  useRequestMediaLibraryPermission,
} from "hooks";

import { SurveySelectors } from "state/survey";
import { ConfirmActions } from "state/confirm";
import { RecordFileService } from "service/recordFileService";

import { useNodeComponentLocalState } from "screens/RecordEditor/useNodeComponentLocalState";

export const useNodeImageComponent = ({ nodeUuid }) => {
  const dispatch = useDispatch();

  const { request: requestCameraPermission } = useRequestCameraPermission();

  const { request: requestMediaLibraryPermission } =
    useRequestMediaLibraryPermission();

  const survey = SurveySelectors.useCurrentSurvey();
  const surveyId = survey.id;

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
      if (!result.canceled) {
        const asset = result.assets?.[0];
        if (!asset) return;

        const sourceFileUri = asset.uri;
        setPickedImageUri(sourceFileUri);

        const info = await FileSystem.getInfoAsync(sourceFileUri);

        const fileName = sourceFileUri.substring(
          sourceFileUri.lastIndexOf("/") + 1
        );
        const fileSize = info.size;
        const valueUpdated = { fileUuid: UUIDs.v4(), fileName, fileSize };
        await updateNodeValue(valueUpdated, sourceFileUri);
      }
    },
    [fileUuid]
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
          messageKey: "dataEntry:pictureDeleteConfirmMessage",
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
          messageKey: "dataEntry:pictureDeleteConfirmMessage",
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
        messageKey: "dataEntry:pictureDeleteConfirmMessage",
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
