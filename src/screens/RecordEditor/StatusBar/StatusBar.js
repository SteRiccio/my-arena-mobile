import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import {
  CollapsiblePanel,
  FieldSet,
  FormItem,
  HView,
  Icon,
  Text,
} from "components";
import { useTranslation } from "localization";
import { BatteryState } from "model";
import { DeviceInfoActions, DeviceInfoSelectors } from "state";
import { Files, TimeUtils } from "utils";

import { BatteryIcon } from "./BatteryIcon";

import styles from "./styles.js";

const statusUpdateDelay = 10000; // 10 sec

const getBatteryPercent = (batteryLevel) =>
  `${Math.round(batteryLevel * 100)}%`;

export const StatusBar = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const intervalIdRef = useRef(null);
  const {
    batteryLevel,
    batteryState,
    batteryTimeToDischarge,
    batteryTimeToFullCharge,
    freeDiskStorage,
  } = DeviceInfoSelectors.useDeviceInfo();

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      dispatch(DeviceInfoActions.updatePowerStateAndFreeDiskStorage());
    }, statusUpdateDelay);

    return () => {
      const intervalId = intervalIdRef.current;
      if (intervalId) {
        clearTimeout(intervalIdRef.current);
      }
    };
  }, []);

  const formatRemainingTimeCompact = (time) =>
    TimeUtils.formatRemainingTimeIfLessThan1Day({
      time,
      t,
      formatMode: TimeUtils.formatModes.compact,
    });

  const formatRemainingTimeShort = (time) =>
    TimeUtils.formatRemainingTimeIfLessThan1Day({
      time,
      t,
      formatMode: TimeUtils.formatModes.short,
    });

  const batteryTimeToDischargeFormatted = formatRemainingTimeCompact(
    batteryTimeToDischarge
  );
  const batteryTimeToDischargeFormattedShort = formatRemainingTimeShort(
    batteryTimeToDischarge
  );
  const batteryTimeToFullChargeFormattedShort = formatRemainingTimeShort(
    batteryTimeToFullCharge
  );
  const freeDiskStorageFormatted =
    Files.toHumanReadableFileSize(freeDiskStorage);

  return (
    <CollapsiblePanel
      headerContent={
        <HView style={styles.headerContent}>
          <HView>
            <BatteryIcon
              batteryLevel={batteryLevel}
              batteryState={batteryState}
            />
            <Text variant="titleSmall">{getBatteryPercent(batteryLevel)}</Text>
            {batteryState === BatteryState.unplugged &&
              batteryTimeToDischargeFormatted && (
                <Text variant="titleSmall">
                  {batteryTimeToDischargeFormatted}
                </Text>
              )}
          </HView>
          <HView>
            <Icon source="chart-pie" size={20} />
            <Text variant="titleSmall">
              {t("common:sizeAvailable", {
                size: freeDiskStorageFormatted,
              })}
            </Text>
          </HView>
        </HView>
      }
    >
      <FieldSet headerKey="device:battery.title">
        <FormItem labelKey="device:battery.level">
          {getBatteryPercent(batteryLevel)}
        </FormItem>
        {batteryState && (
          <FormItem labelKey="device:battery.statusLabel">
            {t(`device:battery.status.${batteryState}`)}
          </FormItem>
        )}
        {batteryTimeToDischargeFormattedShort && (
          <FormItem labelKey="device:battery.timeLeftToDischarge">
            {batteryTimeToDischargeFormattedShort}
          </FormItem>
        )}
        {batteryTimeToFullChargeFormattedShort && (
          <FormItem labelKey="device:battery.timeLeftToFullCharge">
            {batteryTimeToFullChargeFormattedShort}
          </FormItem>
        )}
      </FieldSet>
      <FieldSet headerKey="device:internalMemory.title">
        <FormItem labelKey="device:internalMemory.storageAvailable">
          {freeDiskStorageFormatted}
        </FormItem>
      </FieldSet>
    </CollapsiblePanel>
  );
};
