import { useEffect, useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

import { HView, Text, TextInput, VView } from "../../components";
import { SettingsService } from "../../service/settingsService";

const defaultServerUrl = "https://openforis-arena.org";

export const SettingsScreen = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      setSettings(await SettingsService.getSettings());
    };
    fetchSettings();
  }, []);

  const onSettingsUpdate = async (settingsUpdateFn) => {
    const settingsUpdated = settingsUpdateFn(settings);
    setSettings(settingsUpdated);
    await SettingsService.setSettings(settingsUpdated);
  };

  const onServerUrlTypeChange = async (type) => {
    await onSettingsUpdate((settings) => ({
      ...settings,
      serverUrlType: type,
      serverUrl: type === "default" ? defaultServerUrl : serverUrl,
    }));
  };

  const onServerUrlChange = async (serverUrlUpdated) => {
    await onSettingsUpdate((settings) => ({
      ...settings,
      serverUrl: serverUrlUpdated.trim(),
    }));
  };

  const { serverUrl, serverUrlType } = settings;

  return (
    <VView>
      <RadioButton.Group
        onValueChange={onServerUrlTypeChange}
        value={serverUrlType}
      >
        <HView>
          <RadioButton.Item label="Default" value="default" />
          <RadioButton.Item label="Custom" value="custom" />
        </HView>
      </RadioButton.Group>
      <TextInput
        editable={serverUrlType === "custom"}
        value={serverUrl}
        onChange={onServerUrlChange}
      />
    </VView>
  );
};
