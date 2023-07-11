import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
  MD3DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
  ThemeProvider,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";

import { AppConfirmDialog } from "appComponents/AppConfirmDialog";
import { AppMessageDialog } from "appComponents/AppMessageDialog";
import { JobMonitorDialog } from "appComponents/JobMonitorDialog";

import { View } from "components";
import { Themes } from "model";
import { AppStack } from "navigation/AppStack";
import { rootReducer } from "state/reducers";
import { useEffectiveTheme } from "hooks";

import { AppInitializer } from "./AppInitializer";

import styles from "appStyles";

const store = createStore(rootReducer, applyMiddleware(thunk));

const AppInnerContainer = () => {
  const themeSetting = useEffectiveTheme();
  const theme = themeSetting === Themes.dark ? MD3DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <StatusBar style={theme.dark ? "light" : "dark"} />
          <AppInitializer>
            <AppStack />
            <AppMessageDialog />
            <AppConfirmDialog />
            <JobMonitorDialog />
          </AppInitializer>
        </View>
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
