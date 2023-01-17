import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "../screens/HomeScreen";
import { RecordEditor } from "../screens/RecordEditor/RecordEditor";

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "My Arena Mobile" }}
        />
        <Stack.Screen name="RecordEditor" component={RecordEditor} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
