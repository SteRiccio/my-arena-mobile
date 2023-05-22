import React, { useCallback, useEffect, useState } from "react";
import { RadioButton } from "react-native-paper";
import { useDispatch } from "react-redux";

import { Button, FieldSet, HView, TextInput, VView } from "components";
import { useTranslation } from "localization";
import { SettingsService } from "service";
import { RemoteConnectionActions } from "state";

const serverUrlTypes = {
  default: "default",
  custom: "custom",
};

export const LoginScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [state, setState] = useState({
    serverUrl: SettingsService.defaultServerUrl,
    serverUrlType: serverUrlTypes.default,
    email: "",
    password: "",
  });

  const { email, password, serverUrl, serverUrlType } = state;

  useEffect(() => {
    const initialize = async () => {
      const settings = await SettingsService.fetchSettings();

      const serverUrlNext = settings.serverUrl
        ? settings.serverUrl
        : SettingsService.defaultServerUrl;

      const serverUrlTypeNext =
        serverUrlNext === SettingsService.defaultServerUrl
          ? serverUrlTypes.default
          : serverUrlTypes.custom;

      setState((statePrev) => ({
        ...statePrev,
        serverUrl: serverUrlNext,
        serverUrlType: serverUrlTypeNext,
        email: settings.email || "",
        password: settings.password || "",
      }));
    };
    initialize();
  }, []);

  const onServerUrlTypeChange = useCallback(
    async (type) =>
      setState((statePrev) => ({
        ...statePrev,
        serverUrlType: type,
        serverUrl:
          type === serverUrlTypes.default
            ? SettingsService.defaultServerUrl
            : serverUrl,
      })),
    [serverUrl]
  );

  const onServerUrlChange = useCallback(
    async (serverUrlUpdated) =>
      setState((statePrev) => ({
        ...statePrev,
        serverUrl: serverUrlUpdated.trim(),
      })),
    []
  );

  const onEmailChange = useCallback(
    async (text) => setState((statePrev) => ({ ...statePrev, email: text })),
    []
  );

  const onPasswordChange = useCallback(
    async (text) => setState((statePrev) => ({ ...statePrev, password: text })),
    []
  );

  const onLogin = useCallback(async () => {
    dispatch(RemoteConnectionActions.login({ serverUrl, email, password }));
  }, [email, password, serverUrl]);

  return (
    <VView>
      <FieldSet heading="login:serverUrl">
        <RadioButton.Group
          onValueChange={onServerUrlTypeChange}
          value={serverUrlType}
        >
          <HView>
            {Object.values(serverUrlTypes).map((type) => (
              <RadioButton.Item
                key={type}
                label={t(`login:serverUrlType.${type}`)}
                value={type}
              />
            ))}
          </HView>
        </RadioButton.Group>
        <TextInput
          disabled={serverUrlType === serverUrlTypes.default}
          value={serverUrl}
          onChange={onServerUrlChange}
        />
      </FieldSet>

      <TextInput label="login:email" onChange={onEmailChange} value={email} />
      <TextInput
        label="login:password"
        onChange={onPasswordChange}
        value={password}
        secureTextEntry
      />
      <Button onPress={onLogin}>Login</Button>
    </VView>
  );
};
