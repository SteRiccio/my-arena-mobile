import axios from "axios";

import { Strings } from "@openforis/arena-core";

const config = { withCredentials: true };

const getUrl = ({ serverUrl, uri }) => {
  const parts = [];
  parts.push(Strings.removeSuffix("/")(serverUrl));
  parts.push(Strings.removePrefix("/")(uri));
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
