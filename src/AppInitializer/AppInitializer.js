import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { DowngradeError, initialize as initializeDb } from "db";
import { AppLogo } from "appComponents/AppLogo";
import { Text, View, VView } from "components";
import {
  DataMigrationService,
  PreferencesService,
  SettingsService,
  SurveyService,
} from "service";
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
      if (__DEV__) {
        console.log("Initializing app");
      }
      await dispatch(DeviceInfoActions.initDeviceInfo());

      const settings = await SettingsService.fetchSettings();
      await dispatch(SettingsActions.updateSettings(settings));

      if (settings.fullScreen) {
        await SystemUtils.setFullScreen(settings.fullScreen);
      }
      if (settings.keepScreenAwake) {
        await SystemUtils.setKeepScreenAwake(settings.keepScreenAwake);
      }
      if (settings.locationGpsLocked) {
        await dispatch(SettingsActions.startGpsLocking());
      }

      const { dbMigrationsRun, prevDbVersion } = await initializeDb();

      if (dbMigrationsRun) {
        await DataMigrationService.migrateData({ prevDbVersion });
      }

      // initialize local surveys
      const surveySummaries = await SurveyService.fetchSurveySummariesLocal();
      if (surveySummaries.length === 0) {
        await SurveyService.importDemoSurvey();
      }

      await dispatch(SurveyActions.fetchAndSetLocalSurveys());

      const currentSurveyId = await PreferencesService.getCurrentSurveyId();
      if (currentSurveyId) {
        dispatch(
          SurveyActions.fetchAndSetCurrentSurvey({ surveyId: currentSurveyId })
        );
      }

      dispatch(RemoteConnectionActions.checkLoggedIn());

      if (__DEV__) {
        console.log("App initialized");
      }
    };
    initialize()
      .then(() => {
        setState((statePrev) => ({ ...statePrev, loading: false }));
      })
      .catch((err) => {
        if (__DEV__) {
          console.error("===error", err);
        }
        const errorMessage =
          err instanceof DowngradeError
            ? "Downgrade error"
            : "Unexpected error: " + err;
        setState((statePrev) => ({
          ...statePrev,
          loading: false,
          errorMessage,
        }));
      });
  }, [dispatch]);

  if (loading) {
    return (
      <VView style={styles.container}>
        <AppLogo style={styles.logo} />
        <Text textKey="app:pleaseWaitMessage" />
      </VView>
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

AppInitializer.propTypes = {
  children: PropTypes.node,
};
