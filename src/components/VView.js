import React from "react";
import { View } from "react-native";

export const VView = (props) => {
  const { children, style, ...otherProps } = props;

  return (
    <View style={[style, { flexDirection: "column" }]} {...otherProps}>
      {children}
    </View>
  );
};

VView.defaultProps = {
  style: {},
};
