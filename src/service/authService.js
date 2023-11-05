import { API } from "./api";
import { RemoteService } from "./remoteService";

const fetchUser = async () => {
  const { data } = await RemoteService.get("/auth/user");
  return data.user;
};

const login = async ({ serverUrl: serverUrlParam, email, password }) => {
  const serverUrl = serverUrlParam ?? (await RemoteService.getServerUrl());
  try {
    const res = await API.post(serverUrl, "/auth/login", {
      email,
      password,
    });
    return res?.data;
  } catch (err) {
    if (!err.response) {
      return { error: "authService:error.invalidServerUrl" };
    }
    if (err?.response?.status === 401) {
      return { error: "authService:error.invalidCredentials" };
    }
    return { error: err };
  }
};

const logout = async () => {
  const serverUrl = await RemoteService.getServerUrl();
  try {
    const res = await API.post(serverUrl, "/auth/logout");
    return res?.data;
  } catch (err) {
    if (!err.response) {
      return { error: "authService:error.invalidServerUrl" };
    }
    return { error: err };
  }
};

export const AuthService = {
  fetchUser,
  login,
  logout,
};
