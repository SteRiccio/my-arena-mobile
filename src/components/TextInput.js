import React from "react";
import { TextInput as RNPTextInput } from "react-native-paper";

export const TextInput = (props) => {
  const {
    disabled,
    editable,
    keyboardType,
    label: labelKey,
    placeholder: placeholderKey,
    onChange,
    onPressIn,
    secureTextEntry,
    style,
    value,
  } = props;

  return (
    <RNPTextInput
      disabled={disabled}
      editable={editable}
      keyboardType={keyboardType}
      mode="outlined"
      label={labelKey}
      onChangeText={onChange}
      onPressIn={onPressIn}
      placeholder={placeholderKey}
      secureTextEntry={secureTextEntry}
      style={style}
      value={value}
    />
  );
};
