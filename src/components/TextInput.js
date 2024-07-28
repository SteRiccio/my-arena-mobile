import React from "react";
import PropTypes from "prop-types";
import { TextInput as RNPTextInput, useTheme } from "react-native-paper";

import { useTranslation } from "localization";

export const TextInput = (props) => {
  const {
    autoCapitalize,
    disabled = false,
    editable = false,
    error = false,
    keyboardType,
    label: labelKey,
    nonEditableStyleVisible = true,
    multiline = false,
    numberOfLines,
    placeholder: placeholderKey,
    onChange,
    onPressIn,
    secureTextEntry,
    style: styleProp = {},
    value,
    ...otherProps
  } = props;

  const { t } = useTranslation();
  const theme = useTheme();

  const showAsReadOnly = !editable && nonEditableStyleVisible;

  const label = t(labelKey);
  const placeholder = t(placeholderKey);

  const notEditableStyle = { backgroundColor: theme.colors.surfaceVariant };

  const style = [...(showAsReadOnly ? [notEditableStyle] : []), styleProp];

  return (
    <RNPTextInput
      autoCapitalize={autoCapitalize}
      disabled={disabled}
      editable={editable}
      error={error}
      keyboardType={keyboardType}
      label={label}
      mode="outlined"
      multiline={multiline}
      numberOfLines={numberOfLines}
      onChangeText={onChange}
      onPressIn={onPressIn}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={style}
      theme={theme}
      value={value}
      {...otherProps}
    />
  );
};

TextInput.propTypes = {
  autoCapitalize: PropTypes.string,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  error: PropTypes.bool,
  keyboardType: PropTypes.string,
  label: PropTypes.string,
  nonEditableStyleVisible: PropTypes.bool,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onPressIn: PropTypes.func,
  secureTextEntry: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.string,
};
