import React from "react";
import { useNavigation } from "@react-navigation/native";

import { useTranslation } from "localization";
import { Button, Text, VView } from "components";
import { LocalSurveysDropdown } from "./LocalSurveysDropdown";
import { screenKeys } from "../screenKeys";
import styles from "./styles";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <VView style={styles.container}>
      <Text
        style={styles.appTitle}
        variant="displayMedium"
        textKey={t("common:appTitle")}
      />
      <VView>
        <LocalSurveysDropdown navigation={navigation} />
        <Button
          textKey={t("surveys:manageSurveys")}
          style={{ marginTop: 40 }}
          onPress={() => navigation.navigate(screenKeys.surveysListLocal)}
        />
      </VView>
    </VView>
  );
};
