import React from "react";
import { View as RNView } from "react-native";
import { useTheme } from "react-native-paper";
import PropTypes from "prop-types";

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

View.propTypes = {
  children: PropTypes.node,
  fullWidth: PropTypes.bool,
  style: PropTypes.object,
  transparent: PropTypes.bool,
};

View.defaultProps = {
  fullWidth: false,
  style: {},
  transparent: false,
};
