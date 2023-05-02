import React from "react";
import { Checkbox as RNPCheckbox } from "react-native-paper";

export const Checkbox = (props) => {
  const { checked, label, onPress, ...otherProps } = props;

  return (
    <RNPCheckbox.Item
      {...otherProps}
      label={label}
      onPress={onPress}
      status={checked ? "checked" : "unchecked"}
    />
  );
};
