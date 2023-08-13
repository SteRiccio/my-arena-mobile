import React from "react";
import { IconButton as RNPIconButton } from "react-native-paper";

export const IconButton = (props) => {
  const { disabled, icon, iconColor, ...otherProps } = props;
  return (
    <RNPIconButton
      disabled={disabled}
      icon={icon}
      iconColor={iconColor}
      {...otherProps}
    />
  );
};

IconButton.defaultProps = {
  mode: "contained-tonal",
  size: 20,
};
