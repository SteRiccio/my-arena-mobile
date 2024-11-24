import { useMemo } from "react";
import { View } from "./View";

const baseStyle = {
  display: "flex",
  flexDirection: "row",
  gap: 4,
};

export const HView = (props) => {
  const {
    children,
    fullWidth = false,
    style: styleProp,
    ...otherProps
  } = props;

  const style = useMemo(() => [baseStyle, styleProp], [styleProp]);

  return (
    <View fullWidth={fullWidth} style={style} {...otherProps}>
      {children}
    </View>
  );
};

HView.propTypes = View.propTypes;
