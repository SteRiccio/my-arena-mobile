import { AuthService, SettingsService } from "service";

import { MessageActions } from "../message/actions";
import { SettingsActions } from "../settings/actions";

const LOGGED_IN = "LOGGED_IN";
const LOGGED_OUT = "LOGGED_OUT";

const checkLoggedIn = () => {};

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

      dispatch(MessageActions.setMessage({ content: "Login successful!" }));
      dispatch({ type: LOGGED_IN, user });
    } else if (error) {
      dispatch(
        MessageActions.setMessage({
          content: "authService:error.generic",
          contentParams: { details: error },
        })
      );
    }
  };

export const RemoteConnectionActions = {
  checkLoggedIn,
  login,
};
