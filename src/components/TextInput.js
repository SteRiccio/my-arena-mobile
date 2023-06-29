import React from "react";
import { TextInput as RNPTextInput, useTheme } from "react-native-paper";

import { useTranslation } from "localization";

export const TextInput = (props) => {
  const {
    autoCapitalize,
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

  const showAsReadOnly = !editable && nonEditableStyleVisible;

  const label = t(labelKey);

  const notEditableStyle = { backgroundColor: theme.colors.surfaceVariant };

  const style = [...(showAsReadOnly ? [notEditableStyle] : []), styleProp];

  return (
    <RNPTextInput
      autoCapitalize={autoCapitalize}
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
      theme={theme}
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
