import { useDispatch } from "react-redux";

import {
  Button,
  CollapsiblePanel,
  FieldSet,
  FormItem,
  Text,
  VView,
} from "components";
import { useIsNetworkConnected } from "hooks";
import {
  RemoteConnectionActions,
  RemoteConnectionSelectors,
  SettingsSelectors,
} from "state";
import { SettingsService } from "service/settingsService";

import { ConnectionToRemoteServerButton } from "../ConnectionToRemoteServerButton";

import styles from "./styles";

export const LoginInfo = () => {
  const dispatch = useDispatch();

  const networkAvailable = useIsNetworkConnected();
  const user = RemoteConnectionSelectors.useLoggedInUser();
  const settings = SettingsSelectors.useSettings();
  const { email, serverUrl } = settings;

  if (user) {
    return (
      <CollapsiblePanel
        containerStyle={{ width: "90%" }}
        headerKey="loginInfo:loggedInAs"
        headerParams={{ name: user.name }}
      >
        <>
          <FormItem labelKey="loginInfo:name">{user.name}</FormItem>
          <FormItem labelKey="loginInfo:email">{user.email}</FormItem>
          {serverUrl != SettingsService.defaultServerUrl && (
            <FormItem labelKey="loginInfo:serverUrl">{serverUrl}</FormItem>
          )}
          <Button
            mode="contained-tonal"
            style={styles.logoutButton}
            textKey="loginInfo:logout"
            onPress={() => dispatch(RemoteConnectionActions.logout())}
          />
        </>
      </CollapsiblePanel>
    );
  }
  return (
    <FieldSet headerKey="loginInfo:notLoggedIn">
      <VView>
        {email && !networkAvailable && (
          <Text
            numberOfLines={3}
            textKey="loginInfo:cannotVerifyLoginInformation"
          />
        )}
        <ConnectionToRemoteServerButton />
      </VView>
    </FieldSet>
  );
};
