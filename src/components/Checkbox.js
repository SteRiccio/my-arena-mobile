import React from "react";
import { Checkbox as RNPCheckbox } from "react-native-paper";

export const Checkbox = (props) => {
  const { checked, ...otherProps } = props;

  return (
    <RNPCheckbox {...otherProps} status={checked ? "checked" : "unchecked"} />
  );
};
