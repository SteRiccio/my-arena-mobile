import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { AppLogo } from "appComponents/AppLogo";
import { GpsLockingEnabledWarning } from "appComponents/GpsLockingEnabledWarning";
import { LoginInfo } from "appComponents/LoginInfo";
import { VersionNumberInfoButton } from "appComponents/VersionNumberInfoButton";
import { Button, ScreenView, Text, VView } from "components";
import { MessageActions, SurveySelectors } from "state";

import { screenKeys } from "../screenKeys";
import { SelectedSurveyContainer } from "./SelectedSurveyContainer";

import styles from "./styles";
import { Environment } from "utils/Environment";

export const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const survey = SurveySelectors.useCurrentSurvey();

  useEffect(() => {
    const link =
      Environment.isAndroid || Environment.isExpoGo
        ? "https://play.google.com/store/apps/details?id=org.openforis.arena_mobile"
        : "https://apps.apple.com/app/open-foris-arena-mobile-2/id6741569376";
    console.log("===link", link);
    dispatch(
      MessageActions.setMessage({
        content: "app:deprecationMessage.content",
        details: "app:deprecationMessage.details",
        detailsParams: { link },
      })
    );
  }, [dispatch]);

  const surveySelected = !!survey;

  return (
    <ScreenView>
      <VView style={styles.container}>
        <AppLogo />

        <Text
          style={styles.appTitle}
          variant="headlineSmall"
          textKey="common:appTitle"
        />

        <VersionNumberInfoButton />

        <LoginInfo />

        <GpsLockingEnabledWarning />

        {surveySelected && <SelectedSurveyContainer />}

        <Button
          mode={surveySelected ? "contained-tonal" : "contained"}
          textKey={
            surveySelected ? "surveys:manageSurveys" : "surveys:selectSurvey"
          }
          style={styles.manageSurveysButton}
          onPress={() => navigation.navigate(screenKeys.surveysListLocal)}
        />
      </VView>
    </ScreenView>
  );
};
