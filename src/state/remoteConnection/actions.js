import { AuthService, SettingsService } from "service";
import { i18n } from "localization";

import { ConfirmActions } from "../confirm";
import { MessageActions } from "../message";
import { SettingsActions } from "../settings";

const LOGGED_OUT = "LOGGED_OUT";
const USER_SET = "USER_SET";

const checkLoggedIn = () => async (dispatch) => {
  const settings = await SettingsService.fetchSettings();
  const { serverUrl, email, password } = settings;
  if (!serverUrl || !email || !password) return;

  try {
    const user = await AuthService.fetchUser();
    dispatch({ type: RemoteConnectionActions.USER_SET, user });
  } catch (error) {
    // session expired
    const { user } = await AuthService.login({
      serverUrl,
      email,
      password,
    });
    if (user) {
      dispatch({ type: USER_SET, user });
    }
  }
};

const login =
  ({ serverUrl, email, password }) =>
  async (dispatch) => {
    const res = await AuthService.login({
      serverUrl,
      email,
      password,
    });
    const { user, error } = res;
    if (user) {
      const settings = await SettingsService.fetchSettings();
      const settingsUpdated = { ...settings, serverUrl, email, password };
      dispatch(SettingsActions.updateSettings(settingsUpdated));

      dispatch(
        MessageActions.setMessage({ content: "authService:loginSuccessful" })
      );
      dispatch({ type: USER_SET, user });
    } else if (error) {
      const details = i18n.t(error);
      dispatch(
        MessageActions.setMessage({
          content: "authService:error.generic",
          contentParams: { details },
        })
      );
    }
  };

const _doLogout = async (dispatch) => {
  await AuthService.logout();
  dispatch({ type: RemoteConnectionActions.USER_SET, user: null });
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
