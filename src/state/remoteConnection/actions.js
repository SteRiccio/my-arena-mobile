import { AuthService, SecureStoreService, SettingsService } from "service";
import { i18n } from "localization";

import { ConfirmActions } from "../confirm";
import { MessageActions } from "../message";
import { SettingsActions } from "../settings";

const LOGGED_OUT = "LOGGED_OUT";
const USER_SET = "USER_SET";

const fetchUserOrLoginAgain = async ({ serverUrl, email, password }) => {
  try {
    const user = await AuthService.fetchUser();
    return user;
  } catch (error) {
    // session expired
    const { user } = await AuthService.login({ serverUrl, email, password });
    return user;
  }
};

const checkLoggedIn = () => async (dispatch) => {
  const settings = await SettingsService.fetchSettings();
  const { serverUrl, email, password } = settings;
  if (!serverUrl || !email || !password) return;
  const connectSID = await SecureStoreService.getConnectSIDCookie();
  let user = null;
  if (!connectSID) {
    const loginRes = await AuthService.login({ serverUrl, email, password });
    user = loginRes.user;
  } else {
    user = await fetchUserOrLoginAgain({ serverUrl, email, password });
  }
  if (user) {
    dispatch({ type: USER_SET, user });
  }
};

const login =
  ({ serverUrl, email, password }) =>
  async (dispatch) => {
    const res = await AuthService.login({ serverUrl, email, password });
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
  dispatch({ type: USER_SET, user: null });
};

const logout = () => (dispatch) => {
  dispatch(
    ConfirmActions.show({
      confirmButtonTextKey: "authService:logout",
      messageKey: "authService:logoutConfirmMessage",
      titleKey: "authService:Logout",
      onConfirm: () => dispatch(_doLogout),
    })
  );
};

export const RemoteConnectionActions = {
  LOGGED_OUT,
  USER_SET,
  checkLoggedIn,
  login,
  logout,
};
