import React from "react";
import { IconButton as RNPIconButton } from "react-native-paper";

export const IconButton = (props) => {
  return <RNPIconButton {...props} />;
};

IconButton.defaultProps = {
  mode: "contained-tonal",
  size: 20,
};
