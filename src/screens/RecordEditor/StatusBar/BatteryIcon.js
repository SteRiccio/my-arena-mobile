import PropTypes from "prop-types";

import { Icon } from "components/Icon";
import { useTheme } from "react-native-paper";
import { BatteryState } from "model/BatteryState";

const getBatteryIconSource = ({ batteryLevel, batteryState }) => {
  if (batteryLevel < 0.1) return "battery-alert-variant-outline";
  const suffix = batteryState === BatteryState.charging ? "-charging" : "";
  if (batteryLevel > 0.9) return `battery${suffix}`;
  const batteryLevelDec = Math.ceil(batteryLevel * 10) * 10;
  return `battery-${batteryLevelDec}${suffix}`; // e.g. battery-level-50 or battery-level-50-charging
};

export const BatteryIcon = (props) => {
  const { batteryLevel, batteryState } = props;
  const theme = useTheme();
  const color =
    batteryLevel < 0.2 ? theme.colors.error : theme.colors.onBackground;

  return (
    <Icon
      color={color}
      source={getBatteryIconSource({ batteryLevel, batteryState })}
      size={20}
    />
  );
};

BatteryIcon.propTypes = {
  batteryLevel: PropTypes.number.isRequired,
  batteryState: PropTypes.string,
};
