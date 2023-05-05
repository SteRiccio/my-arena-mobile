import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppBar } from "./AppBar";
import { screens } from "screens/screens";

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <AppBar {...props} />,
        }}
      >
        {Object.keys(screens).map((key) => (
          <Stack.Screen
            key={key}
            name={key}
            component={screens[key].component}
            options={{ title: screens[key].title }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
