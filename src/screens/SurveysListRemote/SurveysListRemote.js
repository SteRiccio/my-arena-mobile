import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { DataTable, VView } from "../../components";
import { SurveyService } from "../../service/surveyService";
import { SurveyActions } from "../../state/survey/actions";

export const SurveysListRemote = (props) => {
  const { navigation } = props;

  const dispatch = useDispatch();

  const [state, setState] = useState({ surveys: [], loading: true });
  const { surveys } = state;

  const loadSurveys = async () => {
    const _surveys = await SurveyService.fetchSurveySummariesRemote();
    setState((statePrev) => ({
      ...statePrev,
      surveys: _surveys,
      loading: false,
    }));
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const onRowPress = useCallback((surveySummary) => {
    const surveyId = surveySummary.id;
    dispatch(SurveyActions.importSurveyRemote({ surveyId, navigation }));
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
        rows={surveys.map((survey) => ({ key: survey.uuid, ...survey }))}
        onRowPress={onRowPress}
      />
    </VView>
  );
};
