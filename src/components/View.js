import React from "react";
import { View as RNView } from "react-native";
import { useTheme } from "react-native-paper";

export const View = (props) => {
  const { children, style, ...otherProps } = props;

  const theme = useTheme();

  return (
    <RNView
      style={[{ backgroundColor: theme.colors.inverseOnSurface }, style]}
      {...otherProps}
    >
      {children}
    </RNView>
  );
};

View.defaultProps = {
  style: {},
};
