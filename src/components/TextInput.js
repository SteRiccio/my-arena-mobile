import React from "react";
import { TextInput as RNPTextInput } from "react-native-paper";

export const TextInput = (props) => {
  const {
    keyboardType,
    label: labelKey,
    placeholder: placeholderKey,
    onChange,
    style,
    value,
  } = props;

  return (
    <RNPTextInput
      keyboardType={keyboardType}
      mode="outlined"
      label={labelKey}
      onChangeText={onChange}
      placeholder={placeholderKey}
      style={style}
      value={value}
    />
  );
};
