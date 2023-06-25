import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { useAssets } from "expo-asset";

import { Button, FieldSet, Text, VView } from "components";
import { screenKeys } from "../screenKeys";
import { SurveySelectors } from "state/survey";
import styles from "./styles";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const survey = SurveySelectors.useCurrentSurvey();
  const [logo] = useAssets(require("../../../assets/icon.png"));

  return (
    <VView style={styles.container}>
      {logo && <Image source={logo} style={styles.logo} />}
      <Text
        style={styles.appTitle}
        variant="displaySmall"
        textKey="common:appTitle"
      />
      {survey && (
        <>
          <FieldSet
            heading="surveys:currentSurvey"
            style={styles.currentSurveyFieldset}
          >
            <Text textKey={survey.props.name} />
          </FieldSet>
          <Button
            textKey="dataEntry:goToDataEntry"
            onPress={() => navigation.navigate(screenKeys.recordsList)}
          />
        </>
      )}
      <Button
        textKey="surveys:manageSurveys"
        style={{ marginTop: 40 }}
        onPress={() => navigation.navigate(screenKeys.surveysListLocal)}
      />
    </VView>
  );
};
