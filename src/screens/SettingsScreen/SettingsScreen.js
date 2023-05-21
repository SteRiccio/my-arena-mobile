import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { HView, Switch, Text, TextInput, VView } from "components";
import { SettingsActions, SettingsSelectors } from "state";
import { Objects } from "@openforis/arena-core";

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
      {Object.entries(properties).map(([key, prop]) => {
        const { type, labelKey } = prop;
        const value = settings[key];
        switch (type) {
          case propertyTypes.boolean:
            return (
              <HView
                key={key}
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text textKey={labelKey} />
                <Switch value={value} onChange={onPropValueChange({ key })} />
              </HView>
            );
          case propertyTypes.numeric:
            return (
              <VView key={key}>
                <Text textKey={labelKey} />
                <TextInput
                  value={Objects.isEmpty(value) ? "" : String(value)}
                  onChange={onPropValueChange({ key })}
                />
              </VView>
            );
        }
      })}
    </VView>
  );
};
