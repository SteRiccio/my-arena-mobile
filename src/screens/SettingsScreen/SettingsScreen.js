import { useCallback, useEffect, useState } from "react";

import { VView } from "../../components";
import { SettingsService } from "../../service/settingsService";

export const SettingsScreen = () => {
  const [settings, setSettings] = useState({});
  // const { serverUrl } = settings;
  // const [credentials, setCredentials] = useState({});

  // const fetchCredentials = useCallback(async () => {
  //   setCredentials(await SettingsService.getCredentials());
  // }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      setSettings(await SettingsService.fetchSettings());
      // await fetchCredentials();
    };
    fetchSettings();
  }, []);

  // useEffect(() => {
  //   fetchCredentials();
  // }, [serverUrl]);

  const updateSettings = useCallback(
    async (settingsUpdateFn) => {
      const settingsUpdated = settingsUpdateFn(settings);
      setSettings(settingsUpdated);
      await SettingsService.saveSettings(settingsUpdated);
    },
    [settings]
  );

  return <VView></VView>;
};
