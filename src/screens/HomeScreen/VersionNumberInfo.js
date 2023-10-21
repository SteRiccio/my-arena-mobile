import { DateFormats, Dates } from "@openforis/arena-core";

import { Text } from "components/Text";
import { useAppInfo } from "hooks/useAppInfo";

import styles from "./versionNumberInfoStyles";

export const VersionNumberInfo = () => {
  const deviceInfo = useAppInfo();

  return (
    <Text style={styles.appVersionName} variant="labelSmall">
      v{deviceInfo.version} [{deviceInfo.buildNumber}] (
      {Dates.convertDate({
        dateStr: deviceInfo.lastUpdateTime,
        formatFrom: DateFormats.datetimeStorage,
        formatTo: DateFormats.dateDisplay,
      })}
      )
    </Text>
  );
};
