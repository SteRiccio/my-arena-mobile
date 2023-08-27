import { useState } from "react";
import { useDispatch } from "react-redux";

import { Objects } from "@openforis/arena-core";

import { ConnectionToRemoteServerButton } from "appComponents/ConnectionToRemoteServerButton";
import {
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
import { SettingsActions, SettingsSelectors } from "state";
import { SettingsModel } from "./SettingsModel";

import styles from "./styles";

const settingsPropertiesEntries = Object.entries(SettingsModel.properties);

const SettingsFormItem = (props) => {
  const { settingKey, labelKey, labelParams, children } = props;
  return (
    <VView key={settingKey}>
      <Text textKey={labelKey} textParams={labelParams} />
      {children}
    </VView>
  );
};

const SettingsItem = (props) => {
  const { settings, settingKey, prop, onPropValueChange } = props;
  const { type, labelKey, options } = prop;
  const value = settings[settingKey];
  switch (type) {
    case SettingsModel.propertyType.boolean:
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
    case SettingsModel.propertyType.numeric:
      return (
        <SettingsFormItem settingsKey={settingKey} labelKey={labelKey}>
          <TextInput
            value={Objects.isEmpty(value) ? "" : String(value)}
            onChange={(value) =>
              onPropValueChange({ key: settingKey })(Number(value))
            }
          />
        </SettingsFormItem>
      );
    case SettingsModel.propertyType.options:
      return (
        <SettingsFormItem settingsKey={settingKey} labelKey={labelKey}>
          <SegmentedButtons
            buttons={options}
            onChange={onPropValueChange({ key: settingKey })}
            value={value}
          />
        </SettingsFormItem>
      );
    case SettingsModel.propertyType.slider:
      const { minValue, maxValue, step } = prop;
      return (
        <SettingsFormItem
          settingsKey={settingKey}
          labelKey={labelKey}
          labelParams={{ value }}
        >
          <Slider
            minValue={minValue}
            maxValue={maxValue}
            step={step}
            value={value}
            onValueChange={onPropValueChange({ key: settingKey })}
          />
        </SettingsFormItem>
      );
    default:
      return null;
  }
};

export const SettingsScreen = () => {
  const dispatch = useDispatch();

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

  const onPropValueChange =
    ({ key }) =>
    (value) => {
      dispatch(SettingsActions.updateSetting({ key, value }));
      setState((statePrev) =>
        Objects.assocPath({ obj: statePrev, path: ["settings", key], value })
      );
    };

  return (
    <ScrollView style={styles.container}>
      <VView>
        <ConnectionToRemoteServerButton />
        {settingsPropertiesEntries.map(([key, prop], index) => (
          <VView key={key} style={styles.settingsItemWrapper}>
            <SettingsItem
              settings={settings}
              settingKey={key}
              prop={prop}
              onPropValueChange={onPropValueChange}
            />
            {index < Object.entries(SettingsModel.properties).length - 1 && (
              <Divider />
            )}
          </VView>
        ))}
      </VView>
    </ScrollView>
  );
};
