import React from "react";
import { View as RNView } from "react-native";
import { useTheme } from "react-native-paper";

export const View = (props) => {
  const {
    children,
    fullWidth,
    style: styleProp,
    transparent,
    ...otherProps
  } = props;

  const theme = useTheme();
  const backgroundColor = transparent ? "transparent" : theme.colors.background;

  const style = [
    { backgroundColor, ...(fullWidth ? { flex: 1, width: "100%" } : {}) },
    styleProp,
  ];

  return (
    <RNView style={style} {...otherProps}>
      {children}
    </RNView>
  );
};

View.defaultProps = {
  fullWidth: false,
  style: {},
  transparent: false,
};
