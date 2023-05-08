import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { DowngradeError, initialize as initializeDb } from "./db";
import { SurveyService } from "service";
import { SettingsActions, SurveyActions } from "state";

import { Text, View } from "./components";

import styles from "./appStyles";

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
        await initializeDb();

        await dispatch(SettingsActions.initSettings());

        // initialize local surveys
        const surveySummaries = await SurveyService.fetchSurveySummariesLocal();
        if (surveySummaries.length === 0) {
          await SurveyService.importDemoSurvey();
        }

        await dispatch(SurveyActions.fetchAndSetLocalSurveys());

        console.log("App initialized");
      } catch (err) {
        console.error("===error", err);
        const errorMessage =
          err instanceof DowngradeError
            ? "Downgrade error"
            : "Unexpected error";
        setState((statePrev) => ({ ...statePrev, errorMessage }));
      }
      setState((statePrev) => ({ ...statePrev, loading: false }));
    };
    initialize();
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
