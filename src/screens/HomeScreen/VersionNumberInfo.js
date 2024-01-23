import { useCallback, useEffect, useState } from "react";
import { Linking } from "react-native";
import { checkVersion } from "react-native-check-version";
import { useDispatch } from "react-redux";

import { DateFormats, Dates } from "@openforis/arena-core";

import { HView, Text, UpdateStatusIcon } from "components";
import { useAppInfo, useIsNetworkConnected, useToast } from "hooks";
import { ConfirmActions } from "state/confirm";
import { UpdateStatus } from "model/UpdateStatus";

import styles from "./versionNumberInfoStyles";

export const VersionNumberInfo = () => {
  const dispatch = useDispatch();
  const appInfo = useAppInfo();
  const networkAvailable = useIsNetworkConnected();
  const toaster = useToast();
  const [state, setState] = useState({ updateStatus: UpdateStatus.loading });
  const { updateStatus, updateStatusError, updateUrl } = state;

  useEffect(() => {
    if (networkAvailable) {
      checkVersion()
        .then((result) => {
          const { error, needsUpdate, url } = result ?? {};
          if (error) {
            setState({
              updateStatus: UpdateStatus.error,
              updateStatusError: error.toString(),
            });
          } else {
            setState({
              updateStatus: needsUpdate
                ? UpdateStatus.notUpToDate
                : UpdateStatus.upToDate,
              updateUrl: url,
            });
          }
        })
        .catch((error) => {
          setState({
            updateStatus: UpdateStatus.error,
            updateStatusError: error.toString(),
          });
        });
    } else {
      setState({ updateStatus: UpdateStatus.networkNotAvailable });
    }
  }, [networkAvailable]);

  const onUpdateConfirm = useCallback(
    () => Linking.openURL(updateUrl),
    [updateUrl]
  );

  const onUpdateStatusIconPress = useCallback(() => {
    switch (updateStatus) {
      case UpdateStatus.error:
        toaster.show("app:updateStatus.error", { error: updateStatusError });
        break;
      case UpdateStatus.networkNotAvailable:
        toaster.show("app:updateStatus.networkNotAvailable");
        break;
      case UpdateStatus.upToDate:
        toaster.show("app:updateStatus.upToDate");
        break;
      case UpdateStatus.notUpToDate:
        dispatch(
          ConfirmActions.show({
            titleKey: "app:confirmUpdate.title",
            confirmButtonTextKey: "app:confirmUpdate.update",
            messageKey: "app:confirmUpdate.message",
            onConfirm: onUpdateConfirm,
          })
        );
        break;
    }
  }, [updateStatus, updateStatusError]);

  return (
    <HView style={styles.container}>
      <Text style={styles.appVersionName} variant="labelLarge">
        v{appInfo.version} [{appInfo.buildNumber}] (
        {Dates.convertDate({
          dateStr: appInfo.lastUpdateTime,
          formatFrom: DateFormats.datetimeStorage,
          formatTo: DateFormats.dateDisplay,
        })}
        )
      </Text>
      {updateStatus !== UpdateStatus.error && (
        <UpdateStatusIcon
          updateStatus={updateStatus}
          onPress={onUpdateStatusIconPress}
        />
      )}
    </HView>
  );
};
