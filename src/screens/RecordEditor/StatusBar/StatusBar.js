import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { CollapsiblePanel, FormItem, HView, Icon, Text } from "components";
import { BatteryState } from "model";
import { DeviceInfoActions, DeviceInfoSelectors } from "state";

const getBatteryIcon = (batteryLevel) => {
  if (batteryLevel > 0.9) return "battery";
  if (batteryLevel > 0.8) return "battery-90";
  if (batteryLevel > 0.7) return "battery-70";
  if (batteryLevel > 0.6) return "battery-60";
  if (batteryLevel > 0.5) return "battery-50";
  if (batteryLevel > 0.4) return "battery-40";
  if (batteryLevel > 0.3) return "battery-30";
  if (batteryLevel > 0.2) return "battery-20";
  if (batteryLevel > 0.1) return "battery-10";
  if (batteryLevel >= 0) return "battery-alert-variant-outline";
};

const getBatteryPercent = (batteryLevel) =>
  `${Math.floor(batteryLevel * 100)}%`;

const formatRemainingTime = (milliseconds) => {
  if (!milliseconds) return "";

  const numberEnding = (number) => (number > 1 ? "s" : "");

  let temp = Math.floor(milliseconds / 1000);
  const years = Math.floor(temp / 31536000);
  if (years) {
    return years + " year" + numberEnding(years);
  }
  //TODO: Months! Maybe weeks?
  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return days + " day" + numberEnding(days);
  }
  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return hours + " hour" + numberEnding(hours);
  }
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return minutes + " minute" + numberEnding(minutes);
  }
  const seconds = temp % 60;
  if (seconds) {
    return seconds + " second" + numberEnding(seconds);
  }
  return "less than a second";
};

export const StatusBar = () => {
  const dispatch = useDispatch();
  const intervalIdRef = useRef(null);
  const {
    batteryLevel,
    batteryState,
    batteryTimeToDischarge,
    batteryTimeToFullCharge,
    batteryLevelMeasureStartTime,
  } = DeviceInfoSelectors.useDeviceInfo();

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      dispatch(DeviceInfoActions.updatePowerState());
    }, 60000);

    return () => {
      const intervalId = intervalIdRef.current;
      if (intervalId) {
        clearTimeout(intervalIdRef.current);
      }
    };
  }, []);

  const batteryTimeToDischargeFormatted = formatRemainingTime(
    batteryTimeToDischarge
  );

  const batteryTimeToFullChargeFormatted = formatRemainingTime(
    batteryTimeToFullCharge
  );

  return (
    <CollapsiblePanel
      headerContent={
        <HView>
          <Icon source={getBatteryIcon(batteryLevel)} />
          <Text variant="titleSmall">{getBatteryPercent(batteryLevel)}</Text>
          {batteryState === BatteryState.unplugged &&
            batteryTimeToDischarge && (
              <Text variant="titleSmall">
                {`${batteryTimeToDischargeFormatted} left to discharge`}
              </Text>
            )}
          {batteryState === BatteryState.charging &&
            batteryTimeToFullCharge && (
              <Text variant="titleSmall">
                {`${batteryTimeToFullChargeFormatted} to full charge`}
              </Text>
            )}
        </HView>
      }
    >
      <FormItem labelKey="device:battery.level">
        {getBatteryPercent(batteryLevel)}
      </FormItem>
      <FormItem labelKey="device:battery.status">{batteryState}</FormItem>
      {batteryTimeToDischarge && (
        <FormItem labelKey="device:battery.timeLeftToDischarge">
          {batteryTimeToDischargeFormatted}
        </FormItem>
      )}
      {batteryTimeToFullCharge && (
        <FormItem labelKey="device:battery.timeLeftToFullCharge">
          {batteryTimeToFullChargeFormatted}
        </FormItem>
      )}
      <FormItem labelKey="device:battery.elapsedMeasureTime">
        {Date.now() - batteryLevelMeasureStartTime}
      </FormItem>
    </CollapsiblePanel>
  );
};
