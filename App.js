import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Provider as PaperProvider, ThemeProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import ErrorBoundary from "react-native-error-boundary";

import { AppConfirmDialog } from "appComponents/AppConfirmDialog";
import { AppMessageDialog } from "appComponents/AppMessageDialog";
import { JobMonitorDialog } from "appComponents/JobMonitorDialog";
import { AppToast } from "appComponents/AppToast";
import { ErrorFallbackComponent } from "appComponents/ErrorFallbackComponent";

import { View } from "components";
import { AppStack } from "navigation/AppStack";
import { rootReducer } from "state/reducers";
import { useEffectiveTheme } from "hooks";

import { AppInitializer } from "./src/AppInitializer";

import styles from "appStyles";

const store = configureStore({ reducer: rootReducer });

const AppInnerContainer = () => {
  const theme = useEffectiveTheme();

  const onError = (error, stackTrace) => {
    console.log(stackTrace, error);
  };

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <ErrorBoundary
          onError={onError}
          FallbackComponent={ErrorFallbackComponent}
        >
          <View style={styles.container}>
            <StatusBar style={theme.dark ? "light" : "dark"} />
            <AppInitializer>
              <AppStack />
            </AppInitializer>
          </View>
        </ErrorBoundary>
        <AppMessageDialog />
        <AppConfirmDialog />
        <JobMonitorDialog />
        <AppToast />
      </ThemeProvider>
    </PaperProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppInnerContainer />
    </Provider>
  );
};

export default App;
