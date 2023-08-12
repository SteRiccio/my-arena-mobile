import React from "react";
import { Slider as RNSlider } from "@miblanchard/react-native-slider";
import { useTheme } from "react-native-paper";

export const Slider = (props) => {
  const { maxValue, minValue, onValueChange, step, value } = props;

  const theme = useTheme();

  return (
    <RNSlider
      minimumTrackTintColor={theme.colors.primary}
      maximumTrackTintColor={theme.colors.inversePrimary}
      thumbTintColor={theme.colors.primary}
      maximumValue={maxValue}
      minimumValue={minValue}
      onValueChange={onValueChange}
      step={step}
      value={value}
    />
  );
};
