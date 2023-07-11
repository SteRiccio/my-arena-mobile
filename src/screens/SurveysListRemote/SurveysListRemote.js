import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { screenKeys } from "../screenKeys";
import { DataTable, Loader, Searchbar, Text, VView } from "components";
import { useNavigationFocus } from "hooks";
import { useSurveysSearch } from "screens/SurveysList/useSurveysSearch";
import { SurveyService } from "service";
import { ConfirmActions, SurveyActions, SurveySelectors } from "state";

import styles from "./styles";

const INITIAL_STATE = {
  surveys: [],
  loading: true,
  errorKey: null,
};

export const SurveysListRemote = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const surveysLocal = SurveySelectors.useSurveysLocal();

  const [state, setState] = useState(INITIAL_STATE);
  const { surveys, loading, errorKey } = state;

  const loadSurveys = async () => {
    setState(INITIAL_STATE);

    const data = await SurveyService.fetchSurveySummariesRemote();
    const { surveys: _surveys = [], errorKey } = data;
    if (errorKey) {
      dispatch(
        ConfirmActions.show({
          titleKey: "Error",
          confirmButtonTextKey: "Login",
          messageKey: "surveys:loadSurveysErrorMessage",
          onConfirm: () =>
            navigation.navigate(screenKeys.settingsRemoteConnection),
          onCancel: () => navigation.goBack(),
        })
      );
    }
    setState((statePrev) => ({
      ...statePrev,
      errorKey,
      loading: false,
      surveys: _surveys,
    }));
  };

  useNavigationFocus({ onFocus: loadSurveys });

  const { onSearchValueChange, searchValue, surveysFiltered } =
    useSurveysSearch({ surveys });

  const onRowPress = useCallback((surveySummary) => {
    const localSurveyWithSameUuid = surveysLocal.find(
      (surveyLocal) => surveyLocal.uuid === surveySummary.uuid
    );

    if (localSurveyWithSameUuid) {
      dispatch(
        ConfirmActions.show({
          confirmButtonTextKey: "surveys:updateSurvey",
          messageKey: "surveys:updateSurveyConfirmMessage",
          onConfirm: () => {
            setState((statePrev) => ({ ...statePrev, loading: true }));
            dispatch(
              SurveyActions.updateSurveyRemote({
                surveyId: localSurveyWithSameUuid.id,
                surveyRemoteId: surveySummary.id,
                navigation,
              })
            );
          },
        })
      );
    } else {
      dispatch(
        ConfirmActions.show({
          confirmButtonTextKey: "surveys:importSurvey",
          messageKey: "surveys:importSurveyConfirmMessage",
          onConfirm: () => {
            setState((statePrev) => ({ ...statePrev, loading: true }));
            const surveyId = surveySummary.id;
            dispatch(
              SurveyActions.importSurveyRemote({ surveyId, navigation })
            );
          },
        })
      );
    }
  }, []);

  if (loading) return <Loader />;

  if (errorKey)
    return (
      <Text
        textKey="surveys:errorFetchingSurveysWithDetails"
        textParams={{ details: errorKey }}
      />
    );

  return (
    <VView style={styles.container}>
      {surveys.length > 5 && (
        <Searchbar value={searchValue} onChange={onSearchValueChange} />
      )}
      {surveysFiltered.length === 0 && (
        <Text textKey="surveys:noAvailableSurveysFound" variant="labelLarge" />
      )}
      {surveysFiltered.length > 0 && (
        <>
          <DataTable
            columns={[
              {
                key: "name",
                header: "common:name",
              },
              {
                key: "defaultLabel",
                header: "common:label",
              },
            ]}
            rows={surveysFiltered.map((survey) => ({
              key: survey.uuid,
              ...survey,
            }))}
            onRowPress={onRowPress}
          />
        </>
      )}
    </VView>
  );
};
