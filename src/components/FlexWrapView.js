import React from "react";
import PropTypes from "prop-types";

import { View } from "./View";

const baseStyle = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  columnGap: 10,
};

export const FlexWrapView = (props) => {
  const { children, style: styleProp = {}, ...otherProps } = props;

  const style = [baseStyle, styleProp];

  return (
    <View style={style} {...otherProps}>
      {children}
    </View>
  );
};

FlexWrapView.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
