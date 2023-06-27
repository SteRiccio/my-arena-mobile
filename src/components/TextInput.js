import React from "react";
import { TextInput as RNPTextInput, useTheme } from "react-native-paper";

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
    ...otherProps
  } = props;

  const { t } = useTranslation();
  const theme = useTheme();

  const showAsReadOnly = disabled || (!editable && nonEditableStyleVisible);

  const label = t(labelKey);

  const notEditableStyle = showAsReadOnly
    ? { backgroundColor: theme.colors.surfaceVariant }
    : {};

  const style = [
    {
      backgroundColor: theme.colors.background,
      ...notEditableStyle,
    },
    styleProp,
  ];

  const textColor = showAsReadOnly
    ? theme.colors.onSurfaceVariant
    : theme.colors.onBackground;

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
      textColor={textColor}
      value={value}
      {...otherProps}
    />
  );
};

TextInput.defaultProps = {
  disabled: false,
  editable: true,
  nonEditableStyleVisible: true,
  style: {},
};
