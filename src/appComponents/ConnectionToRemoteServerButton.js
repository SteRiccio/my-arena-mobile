import { useNavigation } from "@react-navigation/native";

import { Button } from "components";

import { screenKeys } from "screens";

export const ConnectionToRemoteServerButton = () => {
  const navigation = useNavigation();

  return (
    <Button
      textKey="settings:connectionToRemoteServer"
      onPress={() => {
        navigation.navigate(screenKeys.settingsRemoteConnection);
      }}
    />
  );
};
