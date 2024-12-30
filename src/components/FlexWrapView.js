import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { textDirections, useTextDirection } from "localization";
import { BaseStyles } from "utils";
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

  const textDirection = useTextDirection();

  const style = useMemo(() => {
    const _style = [baseStyle];
    if (textDirection === textDirections.rtl) {
      _style.push(BaseStyles.flexDirectionRowReverse);
    }
    _style.push(styleProp);
    return _style;
  }, [styleProp, textDirection]);

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
