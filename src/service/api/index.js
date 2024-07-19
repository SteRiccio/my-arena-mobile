import { Strings, UUIDs } from "@openforis/arena-core";
import * as FileSystem from "expo-file-system";

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

  const result = await fetch(url, { ...options, signal });

  clearTimeout(abortTimeoutId);

  return result;
};

const getUrlWithParams = ({ serverUrl, uri, params }) => {
  const requestParams = Object.entries(params).reduce((acc, [key, value]) => {
    acc.append(key, value);
    return acc;
  }, new URLSearchParams());
  const requestParamsString = requestParams.toString();
  return (
    getUrl({ serverUrl, uri }) +
    (requestParamsString ? "?" + requestParamsString : "")
  );
};

const _sendGet = async (serverUrl, uri, params = {}, options = {}) => {
  const url = getUrlWithParams({ serverUrl, uri, params });
  return fetchWithTimeout(url, options, options?.timeout);
};

const get = async (serverUrl, uri, params = {}, options = {}) => {
  const response = await _sendGet(serverUrl, uri, params, options);

  const data = await response.json();

  return { data };
};

const getFile = async (
  serverUrl,
  uri,
  params,
  callback,
  targetFileUri = null,
  options = {}
) => {
  const url = getUrlWithParams({ serverUrl, uri, params });
  const actualTargetFileUri =
    targetFileUri ?? FileSystem.cacheDirectory + UUIDs.v4() + ".tmp";
  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    actualTargetFileUri,
    options,
    callback
  );
  const { uri: finalTargetUri } = await downloadResumable.downloadAsync();
  return finalTargetUri;
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
    const formDataValue = Array.isArray(value) ? JSON.stringify(value) : value;
    acc.append(key, formDataValue);
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
  getFile,
  post,
  test,
};
