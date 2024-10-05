import React from "react";

import { View } from "./View";

export const VView = (props) => {
  const { children, style, ...otherProps } = props;

  return (
    <View
      style={[{ display: "flex", flexDirection: "column" }, style]}
      {...otherProps}
    >
      {children}
    </View>
  );
};

VView.propTypes = View.propTypes;
