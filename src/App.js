import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
  ThemeProvider,
} from "react-native-paper";

import { AppStack } from "./navigation/AppStack";
import { rootReducer } from "./state/reducers";

import { AppMessageDialog } from "./appComponents/AppMessageDialog";
import { AppConfirmDialog } from "./appComponents/AppConfirmDialog";
import { AppInitializer } from "./AppInitializer";

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  const nightMode = true;

  return (
    <PaperProvider theme={nightMode ? DarkTheme : DefaultTheme}>
      <ThemeProvider theme={nightMode ? DarkTheme : DefaultTheme}>
        <Provider store={store}>
          <AppInitializer>
            <AppStack />
            <AppMessageDialog />
            <AppConfirmDialog />
          </AppInitializer>
        </Provider>
      </ThemeProvider>
    </PaperProvider>
  );
};

export default App;
