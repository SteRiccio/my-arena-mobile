import React, { useCallback, useEffect, useState } from "react";
import { RadioButton } from "react-native-paper";
import { useDispatch } from "react-redux";

import {
  Button,
  FieldSet,
  HView,
  Icon,
  Text,
  TextInput,
  VView,
} from "components";
import { useTranslation } from "localization";
import { SettingsService } from "service";
import { RemoteConnectionActions } from "state";
import { MessageActions } from "state/message";
import { useIsNetworkConnected } from "hooks/useIsNetworkConnected";

const serverUrlTypes = {
  default: "default",
  custom: "custom",
};

export const SettingsRemoteConnectionScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const networkAvailable = useIsNetworkConnected();

  const [state, setState] = useState({
    serverUrl: SettingsService.defaultServerUrl,
    serverUrlType: serverUrlTypes.default,
    serverUrlVerified: false,
    email: "",
    password: "",
  });

  const { email, password, serverUrl, serverUrlType, serverUrlVerified } =
    state;

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
        serverUrlVerified: false,
      })),
    [serverUrl]
  );

  const onServerUrlChange = useCallback(
    async (serverUrlUpdated) =>
      setState((statePrev) => ({
        ...statePrev,
        serverUrl: serverUrlUpdated.trim(),
        serverUrlVerified: false,
      })),
    []
  );

  const onTestUrlPress = useCallback(async () => {
    const valid = await SettingsService.testServerUrl(serverUrl);
    setState((statePrev) => ({ ...statePrev, serverUrlVerified: valid }));
    if (!valid) {
      dispatch(
        MessageActions.setMessage({
          content: "settingsRemoteConnection:serverUrlNotValid",
        })
      );
    }
  }, [serverUrl]);

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
    <VView style={{ padding: 10 }}>
      {!networkAvailable && <Text textKey="common:networkNotAvailable" />}

      <FieldSet heading="settingsRemoteConnection:serverUrl">
        <RadioButton.Group
          onValueChange={onServerUrlTypeChange}
          value={serverUrlType}
        >
          <HView>
            {Object.values(serverUrlTypes).map((type) => (
              <RadioButton.Item
                key={type}
                disabled={!networkAvailable}
                label={t(`settingsRemoteConnection:serverUrlType.${type}`)}
                value={type}
              />
            ))}
          </HView>
        </RadioButton.Group>
        <HView>
          <TextInput
            disabled={
              serverUrlType === serverUrlTypes.default || !networkAvailable
            }
            onChange={onServerUrlChange}
            style={{ width: "90%" }}
            value={serverUrl}
          />
          {serverUrlVerified && <Icon source="check" size={50} />}
        </HView>
        {!serverUrlVerified && (
          <Button
            disabled={!networkAvailable}
            style={{ margin: 10 }}
            textKey="settingsRemoteConnection:testUrl"
            onPress={onTestUrlPress}
          />
        )}
      </FieldSet>

      <TextInput
        disabled={!networkAvailable}
        label="settingsRemoteConnection:email"
        onChange={onEmailChange}
        value={email}
      />
      <TextInput
        disabled={!networkAvailable}
        label="settingsRemoteConnection:password"
        onChange={onPasswordChange}
        value={password}
        secureTextEntry
      />
      <Button
        disabled={!networkAvailable}
        onPress={onLogin}
        style={{ margin: 20 }}
        textKey="settingsRemoteConnection:login"
      />
    </VView>
  );
};
