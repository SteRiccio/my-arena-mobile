import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import {
  Button,
  DataVisualizer,
  Loader,
  Searchbar,
  Text,
  VView,
} from "components";
import { SurveyService } from "service";
import { useNavigationFocus } from "hooks";
import { useSurveysSearch } from "screens/SurveysList/useSurveysSearch";
import { ConfirmActions, SurveyActions, ScreenOptionsSelectors } from "state";
import { screenKeys } from "../screenKeys";

import styles from "./styles";

export const SurveysListLocal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [state, setState] = useState({ surveys: [], loading: true });
  const screenViewMode = ScreenOptionsSelectors.useCurrentScreenViewMode();
  const { loading, surveys } = state;

  const loadSurveys = async () => {
    const _surveys = await SurveyService.fetchSurveySummariesLocal();

    setState((statePrev) => ({
      ...statePrev,
      surveys: _surveys.map((survey) => ({ ...survey, key: survey.id })),
      loading: false,
    }));
  };

  useNavigationFocus({ onFocus: loadSurveys });

  const { onSearchValueChange, searchValue, surveysFiltered } =
    useSurveysSearch({ surveys });

  const onDeleteSelectedItemIds = useCallback((surveyIds) => {
    dispatch(
      ConfirmActions.show({
        titleKey: "surveys:confirmDeleteSurvey.title",
        messageKey: "surveys:confirmDeleteSurvey.message",
        onConfirm: async () => {
          await dispatch(SurveyActions.deleteSurveys(surveyIds));
          await loadSurveys();
        },
        swipeToConfirm: true,
      })
    );
  }, []);

  const onItemPress = useCallback(
    (survey) =>
      dispatch(
        SurveyActions.fetchAndSetCurrentSurvey({
          surveyId: survey.id,
          navigation,
        })
      ),
    []
  );

  if (loading) return <Loader />;

  return (
    <VView style={styles.container}>
      {surveys.length > 1 && (
        <Searchbar value={searchValue} onChange={onSearchValueChange} />
      )}
      {surveysFiltered.length === 0 && (
        <Text textKey="surveys:noAvailableSurveysFound" variant="labelLarge" />
      )}
      {surveysFiltered.length > 0 && (
        <DataVisualizer
          fields={[
            {
              key: "name",
              header: "common:name",
            },
            {
              key: "label",
              header: "common:label",
            },
          ]}
          mode={screenViewMode}
          onDeleteSelectedItemIds={onDeleteSelectedItemIds}
          onItemPress={onItemPress}
          items={surveysFiltered}
          selectable
        />
      )}
      <Button
        style={styles.importButton}
        textKey="surveys:importSurveyFromCloud"
        onPress={() => navigation.navigate(screenKeys.surveysListRemote)}
      />
    </VView>
  );
};
