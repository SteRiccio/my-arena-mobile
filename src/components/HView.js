import React from "react";

import { View } from "./View";

export const HView = (props) => {
  const { children, style: styleProp, ...otherProps } = props;

  const style = [
    {
      display: "flex",
      flexDirection: "row",
      gap: 4,
    },
    styleProp,
  ];

  return (
    <View style={style} {...otherProps}>
      {children}
    </View>
  );
};

HView.defaultProps = {
  fullWidth: false,
  style: {},
};
