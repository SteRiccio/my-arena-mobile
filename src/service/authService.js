import { API } from "./api";
import { SettingsService } from "./settingsService";

const getServerUrl = async () =>
  (await SettingsService.fetchSettings()).serverUrl;

const login = async (email, password) => {
  try {
    const res = await API.post(await getServerUrl(), "/auth/login", {
      email,
      password,
    });
    return res?.data;
  } catch (err) {
    if (!err.response) {
      return { error: "Error::api:invalidServerUrl" };
    }
    if (err?.response?.status === 401) {
      return { error: "Error::authApi:invalidCredentials" };
    }
    return { error: err };
  }
};

export const AuthService = {
  login,
};
