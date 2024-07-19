import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { Objects } from "@openforis/arena-core";

import { ConnectionToRemoteServerButton } from "appComponents/ConnectionToRemoteServerButton";
import {
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
import { NumberUtils } from "utils";

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
    direction = "vertical",
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

SettingsFormItem.propTypes = {
  settingKey: PropTypes.string.isRequired,
  labelKey: PropTypes.string,
  labelParams: PropTypes.object,
  descriptionKey: PropTypes.string,
  descriptionParams: PropTypes.object,
  direction: PropTypes.string,
  children: PropTypes.node,
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
          settingKey={settingKey}
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
          settingKey={settingKey}
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
        <SettingsFormItem settingKey={settingKey} labelKey={labelKey}>
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
          settingKey={settingKey}
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

SettingsItem.propTypes = {
  settings: PropTypes.object.isRequired,
  settingKey: PropTypes.string.isRequired,
  prop: PropTypes.object.isRequired,
  onPropValueChange: PropTypes.func.isRequired,
};

export const SettingsScreen = () => {
  const dispatch = useDispatch();

  const settingsStored = SettingsSelectors.useSettings();

  const [state, setState] = useState({ settings: settingsStored });

  const { settings } = state;

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
      <VView style={styles.settingsWrapper}>
        <ConnectionToRemoteServerButton />
        {settingsPropertiesEntries
          .filter(([, prop]) => !prop.isDisabled?.())
          .map(([key, prop]) => (
            <VView key={key} style={styles.settingsItemWrapper}>
              <SettingsItem
                settings={settings}
                settingKey={key}
                prop={prop}
                onPropValueChange={onPropValueChange}
              />
            </VView>
          ))}
      </VView>
    </ScrollView>
  );
};
