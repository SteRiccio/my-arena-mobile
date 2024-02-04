import React from "react";
import { Checkbox as RNPCheckbox } from "react-native-paper";
import PropTypes from "prop-types";

export const Checkbox = (props) => {
  const { checked, disabled, label, onPress, style } = props;

  return (
    <RNPCheckbox.Item
      disabled={disabled}
      label={label}
      mode="android"
      onPress={onPress}
      status={checked ? "checked" : "unchecked"}
      style={[
        {
          paddingVertical: 0,
          paddingHorizontal: 0,
        },
        style,
      ]}
    />
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};
