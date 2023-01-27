import React from "react";
import { TextInput as RNPTextInput } from "react-native-paper";

export const TextInput = (props) => {
  const {
    editable,
    keyboardType,
    label: labelKey,
    placeholder: placeholderKey,
    onChange,
    style,
    value,
  } = props;

  return (
    <RNPTextInput
      editable={editable}
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
