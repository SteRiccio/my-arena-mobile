import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Objects } from "@openforis/arena-core";

import {
  Button,
  Divider,
  HView,
  ScrollView,
  SegmentedButtons,
  Slider,
  Switch,
  Text,
  TextInput,
  VView,
} from "components";
import { ThemesSettings } from "model";
import { SettingsActions, SettingsSelectors } from "state";
import { screenKeys } from "../screenKeys";
import styles from "./styles";

const propertyTypes = {
  boolean: "boolean",
  numeric: "numeric",
  options: "options",
  slider: "slider",
};

const properties = {
  theme: {
    type: propertyTypes.options,
    labelKey: "settings:theme.label",
    options: Object.values(ThemesSettings).map((theme) => ({
      value: theme,
      label: `settings:theme.${theme}`,
    })),
  },
  animationsEnabled: {
    type: propertyTypes.boolean,
    labelKey: "settings:animationsEnabled",
  },
  locationAccuracyThreshold: {
    type: propertyTypes.numeric,
    labelKey: "settings:locationAccuracyThreshold",
  },
  locationAccuracyWatchTimeout: {
    type: propertyTypes.slider,
    labelKey: "settings:locationAccuracyWatchTimeout",
    minValue: 30,
    maxValue: 300,
    step: 30,
  },
};

const SettingsItem = (props) => {
  const { settings, settingKey, prop, onPropValueChange } = props;
  const { type, labelKey, options } = prop;
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
            onChange={(value) =>
              onPropValueChange({ key: settingKey })(Number(value))
            }
          />
        </VView>
      );
    case propertyTypes.options:
      return (
        <VView key={settingKey}>
          <Text textKey={labelKey} />
          <SegmentedButtons
            buttons={options}
            onChange={onPropValueChange({ key: settingKey })}
            value={value}
          />
        </VView>
      );
    case propertyTypes.slider:
      const { minValue, maxValue, step } = prop;
      return (
        <VView key={settingKey}>
          <HView>
            <Text textKey={labelKey} textParams={{ value }} />
          </HView>
          <Slider
            minValue={minValue}
            maxValue={maxValue}
            step={step}
            value={value}
            onValueChange={onPropValueChange({ key: settingKey })}
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
    <ScrollView style={styles.container}>
      <VView>
        <Button
          textKey="settings:connectionToRemoteServer"
          onPress={() => {
            navigation.navigate(screenKeys.settingsRemoteConnection);
          }}
        />
        {Object.entries(properties).map(([key, prop], index) => (
          <VView key={key} style={styles.settingsItemWrapper}>
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
    </ScrollView>
  );
};
