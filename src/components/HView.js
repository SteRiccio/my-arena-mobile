import { useMemo } from "react";
import PropTypes from "prop-types";

import { textDirections, useTextDirection } from "localization";

import { View } from "./View";

const baseStyle = {
  display: "flex",
  flexDirection: "row",
  gap: 4,
};

const rtlStyle = { flexDirection: "row-reverse" };

export const HView = (props) => {
  const {
    children,
    fullWidth = false,
    style: styleProp,
    textDirectionAware = true,
    ...otherProps
  } = props;

  const textDirection = useTextDirection();

  const style = useMemo(
    () => [
      baseStyle,
      textDirection === textDirections.rtl ? rtlStyle : undefined,
      styleProp,
    ],
    [styleProp, textDirection]
  );

  return (
    <View fullWidth={fullWidth} style={style} {...otherProps}>
      {children}
    </View>
  );
};

HView.propTypes = { ...View.propTypes, textDirectionAware: PropTypes.bool };
