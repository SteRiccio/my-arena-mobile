import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { DataTable, Loader, Text, VView } from "components";
import { screenKeys } from "../screenKeys";
import { SurveyService } from "service";
import { ConfirmActions, SurveyActions } from "state";
import { useNavigationFocus } from "hooks";

export const SurveysListRemote = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [state, setState] = useState({
    surveys: [],
    loading: true,
    errorKey: null,
  });
  const { surveys, loading, errorKey } = state;

  const loadSurveys = async () => {
    const data = await SurveyService.fetchSurveySummariesRemote();
    const { surveys: _surveys, errorKey } = data;
    if (errorKey) {
      dispatch(
        ConfirmActions.show({
          titleKey: "Error",
          confirmButtonTextKey: "Login",
          cancelButtonTextKey: "Cancel",
          messageKey:
            "Error fetching surveys from remote location. User not logged in or session expired. Login to the server?",
          onConfirm: () => navigation.navigate(screenKeys.login),
          onCancel: () => navigation.goBack(),
        })
      );
      setState((statePrev) => ({
        ...statePrev,
        errorKey,
        loading: false,
      }));
    } else {
      setState((statePrev) => ({
        ...statePrev,
        surveys: _surveys,
        loading: false,
      }));
    }
  };

  useNavigationFocus({ onFocus: loadSurveys });

  const onRowPress = useCallback((surveySummary) => {
    setState((statePrev) => ({ ...statePrev, loading: true }));
    const surveyId = surveySummary.id;
    dispatch(SurveyActions.importSurveyRemote({ surveyId, navigation }));
  }, []);

  if (loading) return <Loader />;

  if (errorKey) return <Text textKey={errorKey} />;

  return (
    <VView>
      <DataTable
        columns={[
          {
            key: "name",
            header: "Name",
          },
          {
            key: "defaultLabel",
            header: "Label",
          },
        ]}
        rows={surveys.map((survey) => ({ key: survey.uuid, ...survey }))}
        onRowPress={onRowPress}
      />
    </VView>
  );
};
