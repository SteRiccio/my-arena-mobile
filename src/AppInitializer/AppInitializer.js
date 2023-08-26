import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { DowngradeError, initialize as initializeDb } from "db";
import { Text, View } from "components";
import { SettingsService, SurveyService } from "service";
import {
  DeviceInfoActions,
  RemoteConnectionActions,
  SettingsActions,
  SurveyActions,
} from "state";
import { SystemUtils } from "utils";

import styles from "./styles";

// Crypto (for internal UUIDs generation)
import * as Crypto from "expo-crypto";
if (!global.crypto) {
  global.crypto = Crypto;
}

// Axios
import axios from "axios";
axios.defaults.timeout = 30000;

export const AppInitializer = (props) => {
  const { children } = props;

  const dispatch = useDispatch();

  const [state, setState] = useState({
    loading: true,
    errorMessage: null,
  });
  const { loading, errorMessage } = state;

  useEffect(() => {
    const initialize = async () => {
      console.log("Initializing app");

      await dispatch(DeviceInfoActions.initDeviceInfo());

      const settings = await SettingsService.fetchSettings();
      await dispatch(SettingsActions.updateSettings(settings));

      if (settings.fullScreen) {
        await SystemUtils.setFullScreen(settings.fullScreen);
      }

      await initializeDb();

      // initialize local surveys
      const surveySummaries = await SurveyService.fetchSurveySummariesLocal();
      if (surveySummaries.length === 0) {
        await SurveyService.importDemoSurvey();
      }

      await dispatch(SurveyActions.fetchAndSetLocalSurveys());

      dispatch(RemoteConnectionActions.checkLoggedIn());

      console.log("App initialized");
    };
    initialize()
      .then(() => {
        setState((statePrev) => ({ ...statePrev, loading: false }));
      })
      .catch((err) => {
        console.error("===error", err);
        const errorMessage =
          err instanceof DowngradeError
            ? "Downgrade error"
            : "Unexpected error";
        setState((statePrev) => ({ ...statePrev, errorMessage }));
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text textKey="Initializing application..." />
      </View>
    );
  }
  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text textKey={`Error: ${errorMessage}`} />
      </View>
    );
  }

  return children;
};
