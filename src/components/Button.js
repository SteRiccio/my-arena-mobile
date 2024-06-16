import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Button as RNButton } from "react-native-paper";

import { useTranslation } from "localization";

export const Button = (props) => {
  const {
    children,
    loading,
    mode = "contained",
    onPress: onPressProp,
    textKey,
    textParams,
    ...otherProps
  } = props;

  const { t } = useTranslation();
  const text = t(textKey, textParams);

  const onPress = useCallback(
    (event) => {
      if (!loading) {
        onPressProp(event);
      }
    },
    [loading, onPressProp]
  );

  return (
    <RNButton loading={loading} mode={mode} onPress={onPress} {...otherProps}>
      {text}
      {children}
    </RNButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  mode: PropTypes.oneOf([
    "text",
    "outlined",
    "contained",
    "elevated",
    "contained-tonal",
  ]),
  onPress: PropTypes.func,
  textKey: PropTypes.string,
  textParams: PropTypes.object,
};
