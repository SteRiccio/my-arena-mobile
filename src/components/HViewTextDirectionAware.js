import { useMemo } from "react";

import { textDirections, useTextDirection } from "localization";

import { HView } from "./HView";

export const HViewTextDirectionAware = (props) => {
  const { children, style: styleProp, ...otherProps } = props;

  const textDirection = useTextDirection();

  const style = useMemo(
    () => [
      styleProp,
      textDirection === textDirections.rtl
        ? { flexDirection: "row-reverse" }
        : undefined,
    ],
    [styleProp, textDirection]
  );

  return (
    <HView style={style} {...otherProps}>
      {children}
    </HView>
  );
};

HViewTextDirectionAware.propTypes = HView.propTypes;
