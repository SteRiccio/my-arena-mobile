import React from "react";
import { IconButton as RNPIconButton } from "react-native-paper";

export const IconButton = (props) => {
  const { icon, iconColor, ...otherProps } = props;
  return <RNPIconButton icon={icon} iconColor={iconColor} {...otherProps} />;
};

IconButton.defaultProps = {
  mode: "contained-tonal",
  size: 20,
};
