import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "../screens/HomeScreen";
import { RecordEditor } from "../screens/RecordEditor/RecordEditor";
import { RecordsList } from "../screens/RecordsList";

const Stack = createNativeStackNavigator();

export const screens = {
  home: { key: "home", title: "My Arena Mobile" },
  recordsList: { key: "recordsList", title: "Records List" },
  recordEditor: { key: "recordEditor", title: "Record Editor" },
};

export const AppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
