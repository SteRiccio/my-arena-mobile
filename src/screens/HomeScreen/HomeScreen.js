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
      <VView>
        {survey && (
          <FieldSet heading="surveys:currentSurvey">
            <Text textKey={survey.props.name} />
          </FieldSet>
        )}
        <Button
          textKey="surveys:manageSurveys"
          style={{ marginTop: 40 }}
          onPress={() => navigation.navigate(screenKeys.surveysListLocal)}
        />
      </VView>
    </VView>
  );
};
