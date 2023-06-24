import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Objects } from "@openforis/arena-core";

import {
  Button,
  Divider,
  HView,
  Switch,
  Text,
  TextInput,
  VView,
} from "components";
import { SettingsActions, SettingsSelectors } from "state";
import { screenKeys } from "../screenKeys";

const propertyTypes = {
  boolean: "boolean",
  numeric: "numeric",
};

const properties = {
  animationsEnabled: {
    type: propertyTypes.boolean,
    labelKey: "Animations enabled",
  },
  locationAccuracyThreshold: {
    type: propertyTypes.numeric,
    labelKey: "Location accuracy threshold (meters)",
  },
  locationAccuracyWatchTimeout: {
    type: propertyTypes.numeric,
    labelKey: "Location accuracy watch timeout (seconds)",
  },
};

const SettingsItem = (props) => {
  const { settings, settingKey, prop, onPropValueChange } = props;
  const { type, labelKey } = prop;
  const value = settings[settingKey];
  switch (type) {
    case propertyTypes.boolean:
      return (
        <HView
          key={settingKey}
          style={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text textKey={labelKey} />
          <Switch
            value={value}
            onChange={onPropValueChange({ key: settingKey })}
          />
        </HView>
      );
    case propertyTypes.numeric:
      return (
        <VView key={settingKey}>
          <Text textKey={labelKey} />
          <TextInput
            value={Objects.isEmpty(value) ? "" : String(value)}
            onChange={onPropValueChange({ key: settingKey })}
          />
        </VView>
      );
    default:
      return null;
  }
};

export const SettingsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const settingsStored = SettingsSelectors.useSettings();

  const [state, setState] = useState({ settings: settingsStored });

  const { settings } = state;

  // const { serverUrl } = settings;
  // const [credentials, setCredentials] = useState({});

  // const fetchCredentials = useCallback(async () => {
  //   setCredentials(await SettingsService.getCredentials());
  // }, []);

  // useEffect(() => {
  //   fetchCredentials();
  // }, [serverUrl]);

  const updateSettings = useCallback(
    async (settingsUpdateFn) => {
      const settingsUpdated = settingsUpdateFn(settings);
      dispatch(SettingsActions.updateSettings(settingsUpdated));
      setState({ settings: settingsUpdated });
    },
    [settings]
  );

  const onPropValueChange =
    ({ key }) =>
    (value) =>
      updateSettings((settingsPrev) => ({
        ...settingsPrev,
        [key]: value,
      }));

  return (
    <VView style={{ padding: 10 }}>
      <Button
        textKey="settings:connectionToRemoteServer"
        onPress={() => {
          navigation.navigate(screenKeys.settingsRemoteConnection);
        }}
      />
      {Object.entries(properties).map(([key, prop], index) => (
        <VView key={key} style={{ marginTop: 20 }}>
          <SettingsItem
            settings={settings}
            settingKey={key}
            prop={prop}
            onPropValueChange={onPropValueChange}
          />
          {index < Object.entries(properties).length - 1 && <Divider />}
        </VView>
      ))}
    </VView>
  );
};
