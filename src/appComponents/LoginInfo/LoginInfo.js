import { useDispatch } from "react-redux";

import { Button, FieldSet, FormItem, Text, VView } from "components";
import { useIsNetworkConnected } from "hooks";
import {
  RemoteConnectionActions,
  RemoteConnectionSelectors,
  SettingsSelectors,
} from "state";
import { ConnectionToRemoteServerButton } from "../ConnectionToRemoteServerButton";

import styles from "./styles";

export const LoginInfo = () => {
  const dispatch = useDispatch();

  const networkAvailable = useIsNetworkConnected();
  const user = RemoteConnectionSelectors.useLoggedInUser();
  const settings = SettingsSelectors.useSettings();
  const { email } = settings;

  if (user) {
    return (
      <FieldSet heading="loginInfo:loggedInAs">
        <VView>
          <FormItem labelKey="loginInfo:name">{user.name}</FormItem>
          <FormItem labelKey="loginInfo:email">{user.email}</FormItem>
          <Button
            mode="contained-tonal"
            style={styles.logoutButton}
            textKey="loginInfo:logout"
            onPress={() => dispatch(RemoteConnectionActions.logout())}
          />
        </VView>
      </FieldSet>
    );
  }
  return (
    <FieldSet heading="loginInfo:notLoggedIn">
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
