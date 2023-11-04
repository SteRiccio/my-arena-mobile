import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { screens } from "screens/screens";
import { AppBar } from "./AppBar";
import { screenKeys } from "screens/screenKeys";

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={screenKeys.home}
        screenOptions={{
          header: (props) => <AppBar {...props} />,
        }}
      >
        {Object.entries(screens).map(([key, screen]) => {
          const { component, ...options } = screen;
          return (
            <Stack.Screen
              key={key}
              name={key}
              component={component}
              options={options}
            />
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
