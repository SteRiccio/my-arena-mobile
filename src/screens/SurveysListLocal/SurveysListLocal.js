import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { DataTable, VView } from "components";
import { SurveyService } from "service";
import { useNavigationFocus } from "hooks";
import { ConfirmActions, SurveyActions } from "state";

export const SurveysListLocal = () => {
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
        titleKey: "Delete surveys",
        messageKey: "Delete the selected surveys?",
        onConfirm: async () => {
          await dispatch(SurveyActions.deleteSurveys(surveyIds));
          await loadSurveys();
        },
      })
    );
  }, []);

  return (
    <VView>
      <DataTable
        columns={[
          {
            key: "name",
            header: "Name",
          },
        ]}
        onDeleteSelectedRowIds={onDeleteSelectedRowIds}
        rows={surveys.map((survey) => survey)}
        selectable
      />
    </VView>
  );
};
