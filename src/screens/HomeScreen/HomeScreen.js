import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { useAssets } from "expo-asset";

import { Button, Text, VView } from "components";
import { LocalSurveysDropdown } from "./LocalSurveysDropdown";
import { screenKeys } from "../screenKeys";
import styles from "./styles";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [logo] = useAssets(require("../../../assets/icon.png"));

  return (
    <VView style={styles.container}>
      {logo && <Image source={logo} style={styles.logo} />}
      <Text
        style={styles.appTitle}
        variant="displaySmall"
        textKey="common:appTitle"
      />
      <VView>
        <LocalSurveysDropdown navigation={navigation} />
        <Button
          textKey="surveys:manageSurveys"
          style={{ marginTop: 40 }}
          onPress={() => navigation.navigate(screenKeys.surveysListLocal)}
        />
      </VView>
    </VView>
  );
};
