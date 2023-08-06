import React from "react";
import { Slider as RNSlider } from "@miblanchard/react-native-slider";

export const Slider = (props) => {
  const { containerStyle, maxValue, minValue, onValueChange, step, value } =
    props;

  return (
    <RNSlider
      maximumValue={maxValue}
      minimumValue={minValue}
      onValueChange={onValueChange}
      step={step}
      value={value}
      containerStyle={containerStyle}
    />
  );
};
