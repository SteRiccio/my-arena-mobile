import { useCallback } from "react";
import { RadioButton } from "react-native-paper";

import { HView, Text, TextInput, VView } from "../../components";
import { SettingsService } from "../../service/settingsService";

export const ServerUrlPreference = (props) => {
  const { settings, updateSettings } = props;
  const { serverUrl, serverUrlType } = settings;

  const onServerUrlTypeChange = useCallback(
    async (type) =>
      updateSettings((settings) => ({
        ...settings,
        serverUrlType: type,
        serverUrl:
          type === "default" ? SettingsService.defaultServerUrl : serverUrl,
      })),
    [serverUrl, updateSettings]
  );

  const onServerUrlChange = useCallback(
    async (serverUrlUpdated) =>
      updateSettings((settings) => ({
        ...settings,
        serverUrl: serverUrlUpdated.trim(),
      })),
    [updateSettings]
  );

  return (
    <VView>
      <Text textKey="Server URL" />

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
