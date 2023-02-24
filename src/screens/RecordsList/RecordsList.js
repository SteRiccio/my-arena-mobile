import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Objects, Surveys } from "@openforis/arena-core";

import { Button, DataTable, VView } from "../../components";
import { SurveySelectors } from "../../state/survey/selectors";
import { RecordService } from "../../service/recordService";
import { DataEntryActions } from "../../state/dataEntry/actions";
import { useDispatch } from "react-redux";

export const RecordsList = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();

  const rootDefKeys = useMemo(() => {
    if (!survey) return [];
    const rootDef = Surveys.getNodeDefRoot({ survey });
    return Surveys.getNodeDefKeys({ survey, nodeDef: rootDef });
  }, [survey]);

  const [state, setState] = useState({ records: [], loading: true });
  const { records } = state;

  const loadRecords = useCallback(async () => {
    const _records = await RecordService.fetchRecords({ survey });
    setState((statePrev) => ({
      ...statePrev,
      records: _records,
      loading: false,
    }));
  }, [survey]);

  useEffect(() => {
    if (!survey) return;
    loadRecords();
  }, [survey]);

  const onNewRecordPress = () => {
    dispatch(DataEntryActions.createNewRecord({ navigation }));
  };

  const onRowPress = useCallback((row) => {
    dispatch(
      DataEntryActions.fetchAndEditRecord({ navigation, recordId: row.id })
    );
  }, []);

  return (
    <VView>
      <Button onPress={onNewRecordPress}>New Record</Button>
      <DataTable
        columns={[
          ...rootDefKeys.map((keyDef) => ({
            key: Objects.camelize(keyDef.props.name),
            header: keyDef.props.name,
          })),
          { key: "dateCreated", header: "Created on" },
        ]}
        rows={records.map((record) => ({ key: record.uuid, ...record }))}
        onRowPress={onRowPress}
      />
    </VView>
  );
};
