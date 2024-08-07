import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { DateFormats, Dates } from "@openforis/arena-core";

import { DataVisualizer, Loader, Searchbar, Text, VView } from "components";
import { useNavigationFocus } from "hooks";
import { SurveyService } from "service";
import {
  ConfirmActions,
  DeviceInfoSelectors,
  ScreenOptionsSelectors,
  SurveyActions,
  SurveySelectors,
} from "state";

import { screenKeys } from "../screenKeys";
import { useSurveysSearch } from "../SurveysList/useSurveysSearch";

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
  const screenViewMode = ScreenOptionsSelectors.useCurrentScreenViewMode();
  const isLandscape = DeviceInfoSelectors.useOrientationIsLandscape();

  const dataFields = useMemo(() => {
    const fields = [
      {
        key: "name",
        header: "common:name",
      },
      {
        key: "defaultLabel",
        header: "common:label",
      },
    ];
    if (isLandscape) {
      fields.push({
        key: "datePublished",
        header: "surveys:publishedOn",
        cellRenderer: ({ item }) =>
          Dates.convertDate({
            dateStr: item.datePublished,
            formatFrom: DateFormats.datetimeStorage,
            formatTo: DateFormats.datetimeDisplay,
          }),
      });
    }
    return fields;
  }, [isLandscape]);

  const [state, setState] = useState(INITIAL_STATE);
  const { surveys, loading, errorKey } = state;

  const loadSurveys = async () => {
    setState(INITIAL_STATE);

    const data = await SurveyService.fetchSurveySummariesRemote();
    const { surveys: _surveys = [], errorKey } = data;

    if (errorKey) {
      dispatch(
        ConfirmActions.show({
          titleKey: "error",
          confirmButtonTextKey: "loginInfo:login",
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

  const onRowPress = useCallback(
    (surveySummary) => {
      const surveyName = surveySummary.props.name;
      const localSurveyWithSameUuid = surveysLocal.find(
        (surveyLocal) => surveyLocal.uuid === surveySummary.uuid
      );

      if (localSurveyWithSameUuid) {
        // update existing survey
        dispatch(
          SurveyActions.updateSurveyRemote({
            surveyId: localSurveyWithSameUuid.id,
            surveyRemoteId: surveySummary.id,
            surveyName,
            navigation,
            onConfirm: () =>
              setState((statePrev) => ({ ...statePrev, loading: true })),
          })
        );
      } else {
        // import new survey
        dispatch(
          ConfirmActions.show({
            confirmButtonTextKey: "surveys:importSurvey",
            messageKey: "surveys:importSurveyConfirmMessage",
            messageParams: { surveyName },
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
    },
    [surveysLocal]
  );

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
        <Text
          textKey={
            surveys.length > 0
              ? "surveys:noSurveysMatchYourSearch"
              : "surveys:noAvailableSurveysFound"
          }
          variant="labelLarge"
        />
      )}
      {surveysFiltered.length > 0 && (
        <DataVisualizer
          fields={dataFields}
          items={surveysFiltered.map((survey) => ({
            key: survey.uuid,
            ...survey,
          }))}
          mode={screenViewMode}
          onItemPress={onRowPress}
          showPagination={surveysFiltered.length > 20}
        />
      )}
    </VView>
  );
};
