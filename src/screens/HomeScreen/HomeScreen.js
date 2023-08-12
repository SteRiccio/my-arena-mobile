import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { useAssets } from "expo-asset";

import { Button, FieldSet, Text, VView } from "components";
import { screenKeys } from "../screenKeys";
import { SurveySelectors } from "state/survey";
import { useAppInfo } from "hooks/useAppInfo";

import styles from "./styles";
import { DateFormats, Dates } from "@openforis/arena-core";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const survey = SurveySelectors.useCurrentSurvey();
  const [logo] = useAssets(require("../../../assets/icon.png"));

  const surveyName = survey?.props.name;
  const surveyLabelInDefaultLanguage = survey?.props.labels?.["en"] ?? "";
  const surveyTitle = `${surveyLabelInDefaultLanguage} [${surveyName}]`;
  const deviceInfo = useAppInfo();

  return (
    <VView style={styles.container}>
      {logo && <Image source={logo} style={styles.logo} />}
      <Text
        style={styles.appTitle}
        variant="displaySmall"
        textKey="common:appTitle"
      />
      <Text style={styles.appVersionName} variant="labelSmall">
        v{deviceInfo.version} [{deviceInfo.buildNumber}] (
        {Dates.convertDate({
          dateStr: deviceInfo.lastUpdateTime,
          formatFrom: DateFormats.datetimeISO,
          formatTo: DateFormats.dateDisplay,
        })}
        )
      </Text>
      {survey && (
        <>
          <FieldSet
            heading="surveys:currentSurvey"
            style={styles.currentSurveyFieldset}
          >
            <VView>
              <Text textKey={surveyTitle} variant="titleMedium" />
            </VView>
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
