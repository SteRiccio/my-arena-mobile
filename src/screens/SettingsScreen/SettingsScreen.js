import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { Numbers, Objects } from "@openforis/arena-core";

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
  View,
} from "components";
import { SettingsActions, SettingsSelectors } from "state";
import { SettingsModel } from "./SettingsModel";
import { NumberUtils } from "utils/NumberUtils";

import styles from "./styles";

const settingsPropertiesEntries = Object.entries(SettingsModel.properties);

const numberToString = (value) => (Objects.isEmpty(value) ? "" : String(value));
const stringToNumber = (value) =>
  Objects.isEmpty(value) ? NaN : Number(value);

const SettingsFormItem = (props) => {
  const {
    settingKey,
    labelKey,
    labelParams,
    descriptionKey,
    descriptionParams,
    direction,
    children,
  } = props;

  const style =
    direction === "vertical"
      ? styles.settingsFormItemVertical
      : styles.settingsFormItemHorizontal;

  return (
    <View key={settingKey} style={style}>
      <VView style={{ flex: 1 }}>
        <Text textKey={labelKey} textParams={labelParams} />
        {descriptionKey && (
          <Text
            variant="labelMedium"
            textKey={descriptionKey}
            textParams={descriptionParams}
          />
        )}
      </VView>
      {children}
    </View>
  );
};

SettingsFormItem.defaultProps = {
  direction: "vertical",
};

const SettingsItem = (props) => {
  const { settings, settingKey, prop, onPropValueChange } = props;
  const { type, labelKey, descriptionKey, options } = prop;
  const value = settings[settingKey];

  const [error, setError] = useState(false);

  const onValueChange = useCallback(
    (val) => {
      if (val !== value) {
        onPropValueChange({ key: settingKey })(val);
      }
    },
    [onPropValueChange, value]
  );

  switch (type) {
    case SettingsModel.propertyType.boolean:
      return (
        <SettingsFormItem
          settingsKey={settingKey}
          labelKey={labelKey}
          descriptionKey={descriptionKey}
          direction="horizontal"
        >
          <Switch value={value} onChange={onValueChange} />
        </SettingsFormItem>
      );
    case SettingsModel.propertyType.numeric:
      return (
        <SettingsFormItem
          settingsKey={settingKey}
          labelKey={labelKey}
          descriptionKey={descriptionKey}
        >
          <TextInput
            error={error}
            keyboardType="numeric"
            onChange={(val) => {
              const valueNext = stringToNumber(val);
              setError(numberToString(valueNext) !== val);
              onValueChange(valueNext);
            }}
            defaultValue={numberToString(value)}
          />
        </SettingsFormItem>
      );
    case SettingsModel.propertyType.options:
      return (
        <SettingsFormItem settingsKey={settingKey} labelKey={labelKey}>
          <SegmentedButtons
            buttons={options}
            onChange={onValueChange}
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
            onValueChange={(values) =>
              onValueChange(NumberUtils.roundToDecimals(values[0], 2))
            }
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
