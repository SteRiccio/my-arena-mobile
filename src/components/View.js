import React from "react";
import { View as RNView } from "react-native";

export const View = (props) => {
  const { children, style, ...otherProps } = props;

  return (
    <RNView style={style} {...otherProps}>
      {children}
    </RNView>
  );
};

View.defaultProps = {
  style: {},
};
