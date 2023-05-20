import React from "react";
import { Button as RNButton } from "react-native-paper";

export const Button = (props) => {
  const { children, loading, textKey, ...otherProps } = props;

  return (
    <RNButton loading={loading} {...otherProps}>
      {textKey}
      {children}
    </RNButton>
  );
};

Button.defaultProps = {
  mode: "contained",
};
