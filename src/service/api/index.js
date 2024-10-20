import { Strings, UUIDs } from "@openforis/arena-core";
import { Files } from "utils";

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

const getUrlWithParams = ({ serverUrl, uri, params = {} }) => {
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

const getFileAsBlob = async (serverUrl, uri, params, options) => {
  const response = await _sendGet(serverUrl, uri, params, options);
  return response.blob();
};

const getFileAsText = async (serverUrl, uri, params, options) => {
  const blob = await getFileAsBlob(serverUrl, uri, params, options);
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onError = () => reject(reader.error);
    reader.readAsText(blob);
  });
};

const getFile = async (
  serverUrl,
  uri,
  params,
  _callback,
  targetFileUri = null,
  options = {}
) => {
  const actualTargetFileUri =
    targetFileUri ?? Files.cacheDirectory + UUIDs.v4() + ".tmp";
  const content = await getFileAsBlob(serverUrl, uri, params, options);

  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      Files.writeStringToFile({
        content: base64Data,
        fileUri: actualTargetFileUri,
      })
        .then(resolve(actualTargetFileUri))
        .catch(reject);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(content);
  });
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
  getFileAsBlob,
  getFileAsText,
  getFile,
  post,
  test,
};
