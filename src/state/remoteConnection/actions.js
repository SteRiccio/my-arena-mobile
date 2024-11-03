import { i18n } from "localization";
import { AppService, AuthService, SettingsService } from "service";

import { screenKeys } from "screens/screenKeys";
import { ConfirmActions } from "../confirm";
import { MessageActions } from "../message";
import { SettingsActions } from "../settings";

const LOGGED_OUT = "LOGGED_OUT";
const USER_SET = "USER_SET";

const confirmGoToConnectionToRemoteServer =
  ({ navigation }) =>
  (dispatch) => {
    dispatch(
      ConfirmActions.show({
        confirmButtonTextKey: "settings:connectionToRemoteServer",
        messageKey: "settingsRemoteConnection:errorConnectingWithServer",
        titleKey: "authService:loginRequired",
        onConfirm: () =>
          navigation.navigate(screenKeys.settingsRemoteConnection),
      })
    );
  };

const checkLoggedIn =
  ({ warnIfNotLoggedIn = false, navigation = null } = {}) =>
  async (dispatch) => {
    const user = await AppService.checkLoggedInUser();
    if (user) {
      dispatch({ type: USER_SET, user });
    } else if (warnIfNotLoggedIn && navigation) {
      dispatch(confirmGoToConnectionToRemoteServer({ navigation }));
    }
    return user;
  };

const login =
  ({ serverUrl, email, password }) =>
  async (dispatch) => {
    const res = await AuthService.login({
      serverUrl,
      email,
      password,
    });
    const { user, error, message } = res;
    if (user) {
      const settings = await SettingsService.fetchSettings();
      const settingsUpdated = { ...settings, serverUrl, email, password };
      dispatch(SettingsActions.updateSettings(settingsUpdated));

      dispatch(
        MessageActions.setMessage({ content: "authService:loginSuccessful" })
      );
      dispatch({ type: USER_SET, user });
    } else if (message || error) {
      const errorKeySuffix = [
        "validationErrors.user.userNotFound",
        "validationErrors.user.emailInvalid",
      ].includes(message)
        ? "invalidCredentials"
        : "generic";
      const errorKey = `authService:error.${errorKeySuffix}`;
      const details = i18n.t(error ?? message);

      dispatch(
        MessageActions.setMessage({
          content: errorKey,
          contentParams: { details },
        })
      );
    }
  };

const _doLogout = async (dispatch) => {
  await AuthService.logout();
  const settings = await SettingsService.fetchSettings();
  const settingsUpdated = {
    ...settings,
    email: null,
    password: null,
  };
  dispatch(SettingsActions.updateSettings(settingsUpdated));

  dispatch({ type: USER_SET, user: null });
};

const logout = () => (dispatch) => {
  dispatch(
    ConfirmActions.show({
      confirmButtonTextKey: "authService:logout",
      messageKey: "authService:logoutConfirmMessage",
      titleKey: "authService:logout",
      onConfirm: () => dispatch(_doLogout),
    })
  );
};

export const RemoteConnectionActions = {
  LOGGED_OUT,
  USER_SET,
  confirmGoToConnectionToRemoteServer,
  checkLoggedIn,
  login,
  logout,
};
