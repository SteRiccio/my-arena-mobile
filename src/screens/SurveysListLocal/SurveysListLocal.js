import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Button, DataTable, VView } from "components";
import { SurveyService } from "service";
import { useNavigationFocus } from "hooks";
import { ConfirmActions, SurveyActions } from "state";
import { screenKeys } from "../screenKeys";

export const SurveysListLocal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [state, setState] = useState({ surveys: [], loading: true });
  const { surveys } = state;

  const loadSurveys = async () => {
    const _surveys = await SurveyService.fetchSurveySummariesLocal();

    setState((statePrev) => ({
      ...statePrev,
      surveys: _surveys.map((survey) => ({ ...survey, key: survey.id })),
      loading: false,
    }));
  };

  useNavigationFocus({ onFocus: loadSurveys });

  const onDeleteSelectedRowIds = useCallback((surveyIds) => {
    dispatch(
      ConfirmActions.show({
        titleKey: "surveys:confirmDeleteSurvey.title",
        messageKey: "surveys:confirmDeleteSurvey.message",
        onConfirm: async () => {
          await dispatch(SurveyActions.deleteSurveys(surveyIds));
          await loadSurveys();
        },
      })
    );
  }, []);

  const onRowPress = useCallback(
    (survey) =>
      dispatch(
        SurveyActions.fetchAndSetCurrentSurvey({
          surveyId: survey.id,
          navigation,
        })
      ),
    []
  );

  return (
    <VView>
      <DataTable
        columns={[
          {
            key: "name",
            header: "common:name",
          },
          {
            key: "label",
            header: "common:label",
          },
        ]}
        onDeleteSelectedRowIds={onDeleteSelectedRowIds}
        onRowPress={onRowPress}
        rows={surveys}
        selectable
      />
      <Button
        textKey="Import survey from cloud"
        onPress={() => navigation.navigate(screenKeys.surveysListRemote)}
      />
    </VView>
  );
};
