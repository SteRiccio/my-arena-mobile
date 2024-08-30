import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { DateFormats, Dates, Surveys } from "@openforis/arena-core";

import { DataVisualizer, Loader, Searchbar, Text, VView } from "components";
import { useNavigationFocus } from "hooks";
import { ScreenViewMode } from "model/ScreenViewMode";
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

const DescriptionCellRenderer = ({ item }) => {
  const defaultLanguage = Surveys.getDefaultLanguage(item);
  const description = item.props?.descriptions?.[defaultLanguage];
  return description ? <Text>{description}</Text> : null;
};

const DatePublishedCellRenderer = ({ item }) => (
  <Text>
    {Dates.convertDate({
      dateStr: item.datePublished,
      formatFrom: DateFormats.datetimeStorage,
      formatTo: DateFormats.datetimeDisplay,
    })}
  </Text>
);

const _renderStatusCell =
  (surveysLocal) =>
  ({ item }) => {
    const localSurvey = surveysLocal.find(
      (surveyLocal) => surveyLocal.uuid === item.uuid
    );
    let messageKey = null;
    if (!localSurvey) {
      messageKey = "surveys:loadStatus.notInDevice";
    } else if (Dates.isAfter(item.datePublished, localSurvey.datePublished)) {
      messageKey = "surveys:loadStatus.updated";
    } else {
      messageKey = "surveys:loadStatus.upToDate";
    }
    return <Text textKey={messageKey} />;
  };

export const SurveysListRemote = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const surveysLocal = SurveySelectors.useSurveysLocal();
  const screenViewMode = ScreenOptionsSelectors.useCurrentScreenViewMode();
  const viewAsList = screenViewMode === ScreenViewMode.list;
  const isLandscape = DeviceInfoSelectors.useOrientationIsLandscape();
  const statusCellRenderer = useCallback(
    ({ item }) => _renderStatusCell(surveysLocal)({ item }),
    [surveysLocal]
  );

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
    if (isLandscape || viewAsList) {
      fields.push(
        {
          key: "description",
          header: "surveys:description",
          cellRenderer: DescriptionCellRenderer,
        },
        {
          key: "datePublished",
          header: "surveys:publishedOn",
          cellRenderer: DatePublishedCellRenderer,
        },
        {
          key: "loadStatus",
          header: "surveys:loadStatus.label",
          cellRenderer: statusCellRenderer,
        }
      );
    }
    return fields;
  }, [isLandscape, surveysLocal, viewAsList]);

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
