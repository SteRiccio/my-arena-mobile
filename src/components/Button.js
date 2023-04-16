import React from "react";
import { Button as RNButton } from "react-native-paper";

export const Button = (props) => {
  const { children, textKey, ...otherProps } = props;

  return (
    <RNButton {...otherProps}>
      {textKey}
      {children}
    </RNButton>
  );
};

Button.defaultProps = {
  mode: "contained",
};
