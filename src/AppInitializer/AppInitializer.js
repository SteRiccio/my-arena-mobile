import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SystemNavigationBar from "react-native-system-navigation-bar";

import { DowngradeError, initialize as initializeDb } from "../db";
import { SurveyService } from "service";
import { SettingsActions, SurveyActions } from "state";

import { Text, View } from "../components";

import styles from "./styles";

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

      try {
        await SystemNavigationBar.stickyImmersive();
      } catch (e) {
        // ignore it (not available)
      }

      await initializeDb();

      await dispatch(SettingsActions.initSettings());

      // initialize local surveys
      const surveySummaries = await SurveyService.fetchSurveySummariesLocal();
      if (surveySummaries.length === 0) {
        await SurveyService.importDemoSurvey();
      }

      await dispatch(SurveyActions.fetchAndSetLocalSurveys());

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
