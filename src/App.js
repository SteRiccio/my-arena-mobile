import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { View } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
  ThemeProvider,
} from "react-native-paper";
import { AppStack } from "navigation/AppStack";
import { rootReducer } from "state/reducers";
import { DowngradeError, initialize } from "./db";
import { Text } from "./components";
import styles from "./appStyles";

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  const [state, setState] = useState({
    loading: true,
    errorMessage: null,
  });
  const { loading, errorMessage } = state;
  const nightMode = true;

  useEffect(() => {
    const execute = async () => {
      console.log("Initializing app");
      try {
        await initialize();
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
    execute();
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
  return (
    <PaperProvider theme={nightMode ? DarkTheme : DefaultTheme}>
      <ThemeProvider theme={nightMode ? DarkTheme : DefaultTheme}>
        <Provider store={store}>
          <AppStack />
        </Provider>
      </ThemeProvider>
    </PaperProvider>
  );
};

export default App;
