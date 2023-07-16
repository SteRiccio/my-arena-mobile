import VersionNumber from "react-native-version-number";

export const useDeviceInfo = () => {
  try {
    const buildNumber = VersionNumber.buildVersion();
    const version = VersionNumber.buildVersion();

    return {
      buildNumber,
      version,
    };
  } catch (e) {
    return {};
  }
};
