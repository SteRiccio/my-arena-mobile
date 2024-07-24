import React from "react";
import PropTypes from "prop-types";
import { Button as RNButton } from "react-native-paper";

import { useTranslation } from "localization";
import { useButtonOnPress } from "./useButtonPress";

export const Button = (props) => {
  const {
    avoidMultiplePress = true,
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

  const { actualLoading, onPress } = useButtonOnPress({
    avoidMultiplePress,
    loading,
    onPressProp,
  });

  return (
    <RNButton
      loading={actualLoading}
      mode={mode}
      onPress={onPress}
      {...otherProps}
    >
      {text}
      {children}
    </RNButton>
  );
};

Button.propTypes = {
  avoidMultiplePress: PropTypes.bool,
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
