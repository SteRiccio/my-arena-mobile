import React from "react";
import { View as RNView } from "react-native";
import { useTheme } from "react-native-paper";

export const View = (props) => {
  const { children, style, transparent, ...otherProps } = props;

  const theme = useTheme();
  const backgroundColor = transparent ? "transparent" : theme.colors.background;

  return (
    <RNView style={[{ backgroundColor }, style]} {...otherProps}>
      {children}
    </RNView>
  );
};

View.defaultProps = {
  style: {},
  transparent: false,
};
