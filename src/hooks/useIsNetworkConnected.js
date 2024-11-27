import NetInfo from "@react-native-community/netinfo";

export const useIsNetworkConnected = () => {
  const netInfo = NetInfo.useNetInfo();
  return netInfo.isConnected;
};
