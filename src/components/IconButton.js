import React from "react";
import { IconButton as RNPIconButton } from "react-native-paper";

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
