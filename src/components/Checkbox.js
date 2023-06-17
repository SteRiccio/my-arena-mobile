import React from "react";
import { Checkbox as RNPCheckbox } from "react-native-paper";

export const Checkbox = (props) => {
  const { checked, label, onPress, style, ...otherProps } = props;

  return (
    <RNPCheckbox.Item
      {...otherProps}
      style={[
        {
          paddingVertical: 0,
          paddingHorizontal: 0,
        },
        style,
      ]}
      label={label}
      onPress={onPress}
      status={checked ? "checked" : "unchecked"}
    />
  );
};
