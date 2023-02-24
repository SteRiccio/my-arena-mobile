import axios from "axios";

const config = { withCredentials: true };

const removePrefix = (prefix) => (text) =>
  text.startsWith(prefix) ? text.substring(prefix.length) : text;

const removeSuffix = (suffix) => (text) =>
  text.endsWith(suffix) ? text.substring(0, text.length - suffix.length) : text;

const getUrl = ({ serverUrl, uri }) => {
  const parts = [];
  parts.push(removeSuffix("/")(serverUrl));
  parts.push(removePrefix("/")(uri));
  return parts.join("/");
};

const get = (serverUrl, uri, params = {}) =>
  axios.get(getUrl({ serverUrl, uri }), { ...config, params });

const post = (serverUrl, uri, data) =>
  axios.post(getUrl({ serverUrl, uri }), data, config);

export const API = {
  get,
  post,
};
