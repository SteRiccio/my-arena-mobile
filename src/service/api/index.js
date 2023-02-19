import axios from "axios";

const config = { withCredentials: true };

const get = (serverUrl, url, params = {}) =>
  axios.get(serverUrl + url, { ...config, params });

const post = (serverUrl, url, data) =>
  axios.post(serverUrl + url, data, config);

export const API = {
  get,
  post,
};
