import React from "react";
import { IconButton as RNPIconButton } from "react-native-paper";
import PropTypes from "prop-types";

export const IconButton = (props) => {
  const {
    disabled,
    icon,
    iconColor,
    mode = "contained-tonal",
    size = 20,
    ...otherProps
  } = props;
  return (
    <RNPIconButton
      disabled={disabled}
      icon={icon}
      iconColor={iconColor}
      mode={mode}
      size={size}
      {...otherProps}
    />
  );
};

IconButton.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  mode: PropTypes.string,
  size: PropTypes.number,
};
