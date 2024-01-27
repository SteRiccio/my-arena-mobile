import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const isAndroid = Platform.OS === "android";

export const Environment = {
  isExpoGo,
  isAndroid,
};
