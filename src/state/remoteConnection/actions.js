import { AuthService } from "../../service/authService";
import { SettingsService } from "../../service/settingsService";
import { MessageActions } from "../message/actions";

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
      await SettingsService.saveSettings(settingsUpdated);

      dispatch(MessageActions.setMessage({ content: "Login successful!" }));
      dispatch({ type: LOGGED_IN, user });
    } else if (error) {
      dispatch(MessageActions.setMessage({ content: "Error: " + error }));
    }
  };

export const RemoteConnectionActions = {
  checkLoggedIn,
  login,
};
