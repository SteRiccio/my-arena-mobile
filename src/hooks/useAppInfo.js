import { useEffect, useState } from "react";
import * as Application from "expo-application";
import { Dates } from "@openforis/arena-core";

export const useAppInfo = () => {
  const [state, setState] = useState({});

  useEffect(() => {
    Application.getLastUpdateTimeAsync().then((lastUpdateTime) => {
      setState({
        buildNumber: Application.nativeBuildVersion,
        version: Application.nativeApplicationVersion,
        lastUpdateTime: Dates.formatForStorage(lastUpdateTime),
      });
    });
  }, []);

  return state;
};
