import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Button, Text, VView } from "components";
import { LocalSurveysDropdown } from "./LocalSurveysDropdown";
import { screenKeys } from "../screenKeys";
import styles from "./styles";

export const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <VView style={styles.container}>
      <Text
        style={styles.appTitle}
        variant="displayMedium"
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
