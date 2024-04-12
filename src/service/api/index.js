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

const fetchWithTimeout = async (url, opts = {}, timeout = 120000) => {
  const options = { ...defaultOptions, ...opts };
  const controller = new AbortController();
  const signal = controller.signal;
  const abortTimeoutId = setTimeout(() => controller.abort(), timeout);

  const result = await fetch(url, {
    ...options,
    signal,
  });

  clearTimeout(abortTimeoutId);

  return result;
};

const _sendGet = async (serverUrl, uri, params = {}, options = {}) => {
  const requestParams = Object.entries(params).reduce((acc, [key, value]) => {
    acc.append(key, value);
    return acc;
  }, new URLSearchParams());

  return fetchWithTimeout(
    getUrl({ serverUrl, uri }) +
      (requestParams.size > 0 ? "?" + requestParams.toString() : ""),
    options,
    options?.timeout
  );
};

const get = async (serverUrl, uri, params = {}, options = {}) => {
  const response = await _sendGet(serverUrl, uri, params, options);

  const data = await response.json();

  return { data };
};

const test = async (serverUrl, uri, params = {}) => {
  try {
    const response = await _sendGet(serverUrl, uri, params);
    return response.ok;
  } catch (e) {
    return false;
  }
};

const post = async (serverUrl, uri, data, options = {}) => {
  const formData = Object.entries(data).reduce((acc, [key, value]) => {
    acc.append(key, value);
    return acc;
  }, new FormData());

  const response = await fetchWithTimeout(getUrl({ serverUrl, uri }), {
    ...options,
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
