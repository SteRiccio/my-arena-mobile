import { useDispatch } from "react-redux";

import { Button, FieldSet, FormItem, VView } from "components";
import {
  RemoteConnectionActions,
  RemoteConnectionSelectors,
} from "state/remoteConnection";
import { ConnectionToRemoteServerButton } from "../ConnectionToRemoteServerButton";

import styles from "./styles";

export const LoginInfo = () => {
  const dispatch = useDispatch();
  const user = RemoteConnectionSelectors.useLoggedInUser();

  if (user) {
    return (
      <FieldSet heading="loginInfo:loggedInAs">
        <VView>
          <FormItem labelKey="loginInfo:name">{user.name}</FormItem>
          <FormItem labelKey="loginInfo:email">{user.email}</FormItem>
          <Button
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
        <ConnectionToRemoteServerButton />
      </VView>
    </FieldSet>
  );
};
