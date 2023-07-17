import { useEffect, useState } from "react";
import * as Application from "expo-application";

export const useDeviceInfo = () => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const init = async () => {
      const buildNumber = Application.nativeBuildVersion;
      const version = Application.nativeApplicationVersion;
      const lastUpdateDate = await Application.getLastUpdateTimeAsync();

      setInfo({
        buildNumber,
        version,
        lastUpdateDate,
      });
    };
    init();
  });

  return info;
};
