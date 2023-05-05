import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { HView, Switch, Text, TextInput, VView } from "components";
import { SettingsActions, SettingsSelectors } from "state";

const propertyTypes = {
  boolean: "boolean",
  numeric: "numeric",
};

const properties = {
  animationsEnabled: {
    type: propertyTypes.boolean,
    labelKey: "Animations enabled",
  },
  gpsAccuracyThreshold: {
    type: propertyTypes.numeric,
    labelKey: "GPS accuracy threshold",
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
    <VView>
      {Object.entries(properties).map(([key, prop]) => {
        const { type, labelKey } = prop;
        switch (type) {
          case propertyTypes.boolean:
            return (
              <HView
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text textKey={labelKey} />
                <Switch
                  value={settings[key]}
                  onChange={onPropValueChange({ key })}
                />
              </HView>
            );
          case propertyTypes.numeric:
            return (
              <VView>
                <Text textKey={labelKey} />
                <TextInput
                  value={settings[key]}
                  onChange={onPropValueChange({ key })}
                />
              </VView>
            );
        }
      })}
    </VView>
  );
};
