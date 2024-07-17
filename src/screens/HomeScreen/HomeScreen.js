import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { useAssets } from "expo-asset";

import { GpsLockingEnabledWarning } from "appComponents/GpsLockingEnabledWarning";
import { LoginInfo } from "appComponents/LoginInfo";
import { VersionNumberInfo } from "appComponents/VersionNumberInfo";
import { Button, ScrollView, Text, VView } from "components";
import { SurveySelectors } from "state";

import { screenKeys } from "../screenKeys";
import { SelectedSurveyFieldset } from "./SelectedSurveyFieldet";

import styles from "./styles";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const survey = SurveySelectors.useCurrentSurvey();
  const [logo] = useAssets(require("../../../assets/icon_transparent.png"));

  const surveySelected = !!survey;

  return (
    <ScrollView>
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
    </ScrollView>
  );
};
