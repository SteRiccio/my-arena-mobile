import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

import { Button } from "components";

import { screenKeys } from "screens";

export const ConnectionToRemoteServerButton = () => {
  const navigation = useNavigation();

  const onPress = useCallback(() => {
    navigation.navigate(screenKeys.settingsRemoteConnection);
  }, [navigation]);

  return (
    <Button textKey="settings:connectionToRemoteServer" onPress={onPress} />
  );
};
