import React from "react";

import { View } from "./View";

export const HView = (props) => {
  const {
    children,
    fullWidth = false,
    style: styleProp = {},
    ...otherProps
  } = props;

  const style = [
    {
      display: "flex",
      flexDirection: "row",
      gap: 4,
    },
    styleProp,
  ];

  return (
    <View fullWidth={fullWidth} style={style} {...otherProps}>
      {children}
    </View>
  );
};
