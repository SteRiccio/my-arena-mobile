import { API } from "./api";
import { RemoteService } from "./remoteService";
import { SecureStoreService } from "./SecureStoreService";

const sIdCookiePrefix = "connect.sid=";

const extractConnectSID = (headers) => {
  const cookie = headers?.map["set-cookie"];
  return cookie?.substring(
    sIdCookiePrefix.length,
    cookie.indexOf(";", sIdCookiePrefix.length)
  );
};

const fetchUser = async () => {
  const { data } = await RemoteService.get("/auth/user");
  return data.user;
};

const login = async ({ serverUrl: serverUrlParam, email, password }) => {
  const serverUrl = serverUrlParam ?? (await RemoteService.getServerUrl());
  try {
    const { data, response } = await API.post(serverUrl, "/auth/login", {
      email,
      password,
    });
    const { headers } = response;
    const connectSID = extractConnectSID(headers);
    if (connectSID) {
      await SecureStoreService.setConnectSIDCookie(connectSID);
      return data;
    }
    return { error: "authService:error.invalidCredentials" };
  } catch (err) {
    const { response } = err;
    if (!response) {
      return { error: "authService:error.invalidServerUrl" };
    }
    if (response.status === 401) {
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
