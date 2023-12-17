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
import {
  DeviceInfoSelectors,
  SurveySelectors,
  useBatteryStateListener,
  useFreeDiskStorageMonitor,
} from "state";
import { Files, TimeUtils } from "utils";

import { BatteryIcon } from "./BatteryIcon";

import styles from "./styles.js";
import { useEffect, useState } from "react";
import { RecordFileService } from "service/recordFileService";

const getBatteryPercent = (batteryLevel) =>
  `${Math.round(batteryLevel * 100)}%`;

const StatusBarPanel = (props) => {
  const {
    batteryLevel,
    batteryState,
    batteryTimeToDischargeFormattedShort,
    batteryTimeToFullChargeFormattedShort,
    freeDiskStorageFormatted,
  } = props;

  const { t } = useTranslation();

  const survey = SurveySelectors.useCurrentSurvey();
  const surveyId = survey.id;

  const [state, setState] = useState({
    recordFilesSize: "...",
    tempFilesSize: "...",
  });
  const { recordFilesSize, tempFilesSize } = state;

  useEffect(() => {
    const fetchInfo = async () => {
      const recordFilesSize = surveyId
        ? await RecordFileService.getRecordFilesDirectorySize({ surveyId })
        : null;
      const cacheSize = await Files.getDirSize(Files.getTempFolderParentUri());
      setState({
        recordFilesSize: recordFilesSize
          ? Files.toHumanReadableFileSize(recordFilesSize)
          : null,
        tempFilesSize: Files.toHumanReadableFileSize(cacheSize),
      });
    };
    fetchInfo();
  }, [surveyId]);

  return (
    <>
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
        {recordFilesSize && (
          <FormItem labelKey="device:internalMemory.recordFilesSize">
            {recordFilesSize}
          </FormItem>
        )}
        <FormItem labelKey="device:internalMemory.tempFilesSize">
          {tempFilesSize}
        </FormItem>
      </FieldSet>
    </>
  );
};

export const StatusBar = () => {
  const { t } = useTranslation();

  const {
    batteryLevel,
    batteryState,
    batteryTimeToDischarge,
    batteryTimeToFullCharge,
    freeDiskStorage,
  } = DeviceInfoSelectors.useDeviceInfo();

  useBatteryStateListener();
  useFreeDiskStorageMonitor();

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
      <StatusBarPanel
        batteryLevel={batteryLevel}
        batteryState={batteryState}
        batteryTimeToDischargeFormattedShort={
          batteryTimeToDischargeFormattedShort
        }
        batteryTimeToFullChargeFormattedShort={
          batteryTimeToFullChargeFormattedShort
        }
        freeDiskStorageFormatted={freeDiskStorageFormatted}
      />
    </CollapsiblePanel>
  );
};
