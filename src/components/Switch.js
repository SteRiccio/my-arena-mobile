import * as React from "react";
import { Switch as RNPSwitch } from "react-native-paper";

export const Switch = (props) => {
  const { value, onChange } = props;

  const onValueChange = () => onChange?.(!value);

  return <RNPSwitch value={value} onValueChange={onValueChange} />;
};
