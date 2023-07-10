import axios from "axios";

import { Strings } from "@openforis/arena-core";

const defaultConfig = { withCredentials: true };

const getUrl = ({ serverUrl, uri }) => {
  const parts = [];
  parts.push(Strings.removeSuffix("/")(serverUrl));
  parts.push(Strings.removePrefix("/")(uri));
  return parts.join("/");
};

const get = (serverUrl, uri, params = {}) =>
  axios.get(getUrl({ serverUrl, uri }), { ...defaultConfig, params });

const post = (serverUrl, uri, data, config = {}) =>
  axios.post(getUrl({ serverUrl, uri }), data, { ...defaultConfig, ...config });

export const API = {
  get,
  post,
};
