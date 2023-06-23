import React from "react";
import { TextInput as RNPTextInput } from "react-native-paper";

import { useTranslation } from "localization";

export const TextInput = (props) => {
  const {
    disabled,
    editable,
    keyboardType,
    label: labelKey,
    nonEditableStyleVisible,
    placeholder: placeholderKey,
    onChange,
    onPressIn,
    secureTextEntry,
    style: styleProp,
    value,
  } = props;

  const { t } = useTranslation();

  const label = t(labelKey);

  const style =
    editable || !nonEditableStyleVisible ? {} : { backgroundColor: "#ebebeb" };

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
      style={[styleProp, style]}
      value={value}
    />
  );
};

TextInput.defaultProps = {
  nonEditableStyleVisible: true,
};
