import { useCallback, useEffect, useState } from "react";

import { VView } from "../../components";
import { SettingsService } from "../../service/settingsService";
import { CredentialPreference } from "./CredentialsPreference";
import { ServerUrlPreference } from "./ServerUrlPreference";

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

  // const updateCredentials = useCallback(
  //   async (username, password) =>
  //     SettingsService.setCredentials(serverUrl, username, password),
  //   [serverUrl]
  // );

  return (
    <VView>
      <ServerUrlPreference
        settings={settings}
        updateSettings={updateSettings}
      />
      <CredentialPreference
        settings={settings}
        updateSettings={updateSettings}
      />
    </VView>
  );
};
