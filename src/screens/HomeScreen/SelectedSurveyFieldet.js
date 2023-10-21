import { useNavigation } from "@react-navigation/native";

import { Button, FieldSet, Text, VView } from "components";
import { SurveySelectors } from "state/survey";
import { screenKeys } from "../screenKeys";

import styles from "./selectedSurveyFieldsetStyles";

export const SelectedSurveyFieldset = () => {
  const navigation = useNavigation();

  const survey = SurveySelectors.useCurrentSurvey();

  const surveyName = survey?.props.name;
  const surveyLabelInDefaultLanguage = survey?.props.labels?.["en"] ?? "";
  const surveyTitle = `${surveyLabelInDefaultLanguage} [${surveyName}]`;

  if (!survey) return null;
  return (
    <FieldSet
      heading="surveys:currentSurvey"
      style={styles.currentSurveyFieldset}
    >
      <VView style={styles.currentSurveyFieldsetContainer}>
        <Text textKey={surveyTitle} variant="titleMedium" />
        <Button
          textKey="dataEntry:goToDataEntry"
          onPress={() => navigation.navigate(screenKeys.recordsList)}
        />
      </VView>
    </FieldSet>
  );
};
