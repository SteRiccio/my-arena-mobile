import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { useAssets } from "expo-asset";

import { GpsLockingEnabledWarning } from "appComponents/GpsLockingEnabledWarning";
import { LoginInfo } from "appComponents/LoginInfo";
import { Button, Text, VView } from "components";
import { screenKeys } from "../screenKeys";
import { SurveySelectors } from "state/survey";
import { SelectedSurveyFieldset } from "./SelectedSurveyFieldet";
import { VersionNumberInfo } from "./VersionNumberInfo";

import styles from "./styles";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const survey = SurveySelectors.useCurrentSurvey();
  const [logo] = useAssets(require("../../../assets/icon.png"));

  const surveySelected = !!survey;

  return (
    <VView style={styles.container}>
      {logo && <Image source={logo} style={styles.logo} />}
      <Text
        style={styles.appTitle}
        variant="headlineSmall"
        textKey="common:appTitle"
      />

      <VersionNumberInfo />

      <LoginInfo />

      <GpsLockingEnabledWarning />

      {surveySelected && <SelectedSurveyFieldset />}

      <Button
        mode={surveySelected ? "contained-tonal" : "contained"}
        textKey={
          surveySelected ? "surveys:manageSurveys" : "surveys:selectSurvey"
        }
        style={styles.manageSurveysButton}
        onPress={() => navigation.navigate(screenKeys.surveysListLocal)}
      />
    </VView>
  );
};
