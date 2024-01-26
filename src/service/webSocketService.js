import { RemoteService } from "./remoteService";
import { Environments } from "utils/Environments";

let io;

if (!Environments.isExpoGo) {
  io = require("socket.io-client")?.io;
}

let webSocketInstance = null;

const EVENTS = {
  jobUpdate: "jobUpdate",
};

const open = async () => {
  close();

  const serverUrl = await RemoteService.getServerUrl();

  webSocketInstance = io?.(serverUrl, { withCredentials: true });

  return webSocketInstance;
};

const close = () => {
  webSocketInstance?.close();
  webSocketInstance = null;
};

export const WebSocketService = {
  EVENTS,

  open,
  close,
};
