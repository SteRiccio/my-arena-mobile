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

import { AppMessageDialog } from "./appComponents/AppMessageDialog";
import { AppConfirmDialog } from "./appComponents/AppConfirmDialog";
import { Themes } from "./model";
import { AppStack } from "./navigation/AppStack";
import { rootReducer } from "./state/reducers";
import { useEffectiveTheme } from "hooks";
import { AppInitializer } from "./AppInitializer";

const store = createStore(rootReducer, applyMiddleware(thunk));

const AppInnerContainer = () => {
  const themeSetting = useEffectiveTheme();
  const theme = themeSetting === Themes.dark ? MD3DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <AppInitializer>
          <AppStack />
          <AppMessageDialog />
          <AppConfirmDialog />
        </AppInitializer>
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
