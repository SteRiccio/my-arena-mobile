import React, { useEffect, useMemo, useState } from "react";
import { NodeDefs, Surveys } from "@openforis/arena-core";

import { DataTable } from "../../components";
import { SurveySelectors } from "../../state/survey/selectors";
import { RecordService } from "../../service/recordService";

export const RecordsList = () => {
  const survey = SurveySelectors.useCurrentSurvey();
  const rootDef = Surveys.getNodeDefRoot({ survey });
  const rootDefKeys = useMemo(
    () => Surveys.getNodeDefKeys({ survey, nodeDef: rootDef }),
    [survey, rootDef]
  );

  const [state, setState] = useState({ records: [], loading: true });
  const { records } = state;

  const loadRecords = async () => {
    const _records = await RecordService.fetchRecords({ surveyId: survey.id });
    console.log("records", _records);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <DataTable
      columns={[
        ...rootDefKeys.map((keyDef) => ({
          key: keyDef.props.name,
          header: keyDef.props.name,
        })),
      ]}
      rows={records.map((record) => record)}
    />
  );
};
