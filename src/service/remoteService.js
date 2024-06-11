import { API } from "./api";
import { SettingsService } from "./settingsService";

const statusToErrorKey = {
  500: "internal_server_error",
  401: "invalid_credentials",
};

const handleError = ({ error }) => {
  if (error.response) {
    const status = error.response?.status;
    const errorKey = statusToErrorKey[status] || error.errorMessage;
    return { errorKey };
  } else {
    return { errorKey: "network_error" };
  }
};

const getServerUrl = async () =>
  (await SettingsService.fetchSettings()).serverUrl;

const get = async (uri, params) => API.get(await getServerUrl(), uri, params);

const getFile = async (uri, params, callback) =>
  API.getFile(await getServerUrl(), uri, params, callback);

const post = async (uri, data) => API.post(await getServerUrl(), uri, data);

const postMultipartData = async (uri, data) =>
  API.post(await getServerUrl(), uri, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const RemoteService = {
  getServerUrl,

  get,
  getFile,
  post,
  postMultipartData,
  handleError,
};
