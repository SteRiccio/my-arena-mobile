import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { DataTable, Loader, Text, VView } from "components";
import { screenKeys } from "../screenKeys";
import { SurveyService } from "service";
import { ConfirmActions, SurveyActions, SurveySelectors } from "state";
import { useNavigationFocus } from "hooks";

export const SurveysListRemote = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const surveysLocal = SurveySelectors.useSurveysLocal();

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
    if (
      surveysLocal.some(
        (surveyLocal) => surveyLocal.uuid === surveySummary.uuid
      )
    ) {
      dispatch(
        ConfirmActions.show({
          confirmButtonTextKey: "Update survey",
          cancelButtonTextKey: "Cancel",
          messageKey: "Survey already in this device. Update it?",
          onConfirm: () => {
            // TODO
          },
        })
      );
    } else {
      dispatch(
        ConfirmActions.show({
          confirmButtonTextKey: "Import survey",
          cancelButtonTextKey: "Cancel",
          messageKey: "Import this survey?",
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

  if (errorKey) return <Text textKey={errorKey} />;

  return (
    <VView>
      {surveys.length === 0 && (
        <Text textKey="No available surveys found" variant="labelLarge" />
      )}
      {surveys.length > 0 && (
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
          rows={surveys.map((survey) => ({ key: survey.uuid, ...survey }))}
          onRowPress={onRowPress}
        />
      )}
    </VView>
  );
};
