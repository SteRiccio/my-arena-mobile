import React from "react";
import { TextInput as RNPTextInput } from "react-native-paper";

import { useTranslation } from "localization";

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

  const { t } = useTranslation();

  const label = t(labelKey);

  return (
    <RNPTextInput
      disabled={disabled}
      editable={editable}
      keyboardType={keyboardType}
      mode="outlined"
      label={label}
      onChangeText={onChange}
      onPressIn={onPressIn}
      placeholder={placeholderKey}
      secureTextEntry={secureTextEntry}
      style={style}
      value={value}
    />
  );
};
