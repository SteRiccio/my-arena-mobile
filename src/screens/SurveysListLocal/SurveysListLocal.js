import React, { useEffect, useState } from "react";

import { DataTable, VView } from "../../components";
import { SurveyService } from "../../service/surveyService";

export const SurveysListLocal = () => {
  const [state, setState] = useState({ surveys: [], loading: true });
  const { surveys } = state;

  const loadSurveys = async () => {
    const _surveys = await SurveyService.fetchSurveySummariesLocal();
    setState((statePrev) => ({
      ...statePrev,
      surveys: _surveys,
      loading: false,
    }));
  };

  useEffect(() => {
    loadSurveys();
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
        rows={surveys.map((survey) => survey)}
      />
    </VView>
  );
};
