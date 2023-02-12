import React from "react";
import { View } from "react-native";

export const VView = (props) => {
  const { children, ...otherProps } = props;

  return (
    <View style={[{ flexDirection: "column" }]} {...otherProps}>
      {children}
    </View>
  );
};
