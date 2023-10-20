import { Strings } from "@openforis/arena-core";

const defaultOptions = {
  credentials: "include",
};

const getUrl = ({ serverUrl, uri }) => {
  const parts = [];
  parts.push(Strings.removeSuffix("/")(serverUrl));
  parts.push(Strings.removePrefix("/")(uri));
  return parts.join("/");
};

const fetchWithTimeout = async (
  url,
  options = defaultOptions,
  timeout = 500
) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const abortTimeoutId = setTimeout(() => controller.abort(), timeout);

  const result = await fetch(url, {
    ...defaultOptions,
    ...options,
    signal,
  });

  clearTimeout(abortTimeoutId);

  return result;
};

const _sendGet = async (serverUrl, uri, params = {}) => {
  const requestParams = Object.entries(params).reduce((acc, [key, value]) => {
    acc.append(key, value);
    return acc;
  }, new URLSearchParams());

  return fetchWithTimeout(
    getUrl({ serverUrl, uri }) +
      (requestParams.size > 0 ? "?" + requestParams.toString() : "")
  );
};

const get = async (serverUrl, uri, params = {}) => {
  const response = await _sendGet(serverUrl, uri, params);

  const data = await response.json();

  return { data };
};

const test = async (serverUrl, uri, params = {}) => {
  const response = await _sendGet(serverUrl, uri, params);
  return response.ok;
};

const post = async (serverUrl, uri, data, config = {}) => {
  const formData = Object.entries(data).reduce((acc, [key, value]) => {
    acc.append(key, value);
    return acc;
  }, new FormData());

  const response = await fetchWithTimeout(getUrl({ serverUrl, uri }), {
    ...config,
    method: "POST",
    body: formData,
  });

  return { data: await response.json() };
};

export const API = {
  get,
  post,
  test,
};
