import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { HView, Switch, Text, VView } from "../../components";
import { SettingsActions } from "../../state/settings/actions";
import { SettingsSelectors } from "../../state/settings/selectors";

export const SettingsScreen = () => {
  const dispatch = useDispatch();

  const settingsStored = SettingsSelectors.useSettings();

  const [state, setState] = useState({ settings: settingsStored });

  const { settings } = state;
  const { animationsEnabled } = settings;

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

  return (
    <VView>
      <HView style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Text textKey="Animations" />
        <Switch
          value={animationsEnabled}
          onChange={(val) =>
            updateSettings((settingsPrev) => ({
              ...settingsPrev,
              animationsEnabled: val,
            }))
          }
        />
      </HView>
    </VView>
  );
};
