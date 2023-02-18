import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "../screens/HomeScreen";
import { RecordEditor } from "../screens/RecordEditor/RecordEditor";
import { RecordsList } from "../screens/RecordsList";
import { SettingsScreen } from "../screens/SettingsScreen";
import { AppBar } from "./AppBar";
import { screens } from "./screens";

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <AppBar {...props} />,
        }}
      >
        <Stack.Screen
          name={screens.home.key}
          component={HomeScreen}
          options={{ title: screens.home.title }}
        />
        <Stack.Screen
          name={screens.recordsList.key}
          options={{ title: screens.recordsList.title }}
          component={RecordsList}
        />
        <Stack.Screen
          name={screens.recordEditor.key}
          options={{ title: screens.recordEditor.title }}
          component={RecordEditor}
        />
        <Stack.Screen
          name={screens.settings.key}
          options={{ title: screens.settings.title }}
          component={SettingsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
