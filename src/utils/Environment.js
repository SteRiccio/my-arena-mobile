import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const platform = Platform.OS;
const isAndroid = platform === "android";
const isIOS = platform === "ios";

export const Environment = {
  isExpoGo,
  isAndroid,
  isIOS,
  platform,
};
