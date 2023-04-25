import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import {
  DateFormats,
  Dates,
  NodeDefs,
  NodeValueFormatter,
  Objects,
  Surveys,
} from "@openforis/arena-core";

import { Button, DataTable, VView } from "../../components";
import { useNavigationFocus } from "../../hooks";
import { SurveySelectors } from "../../state/survey/selectors";
import { RecordService } from "../../service/recordService";
import { DataEntryActions } from "../../state/dataEntry/actions";

export const RecordsList = () => {
  const navigation = useNavigation();
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

  // reload records on navigation focus (e.g. going back to records list screen)
  useNavigationFocus({ onFocus: loadRecords });

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

  const recordToRow = (record) => {
    const valuesByKey = rootDefKeys.reduce((acc, keyDef) => {
      const recordKeyProp = Objects.camelize(new String(keyDef.props.name));
      acc[recordKeyProp] = NodeValueFormatter.format({
        survey,
        nodeDef: keyDef,
        value: record[recordKeyProp],
      });
      return acc;
    }, {});

    return {
      ...record,
      key: record.uuid,
      ...valuesByKey,
      dateCreated: Dates.format(
        record.dateCreated,
        DateFormats.datetimeDisplay
      ),
      dateModified: Dates.format(
        record.dateModified,
        DateFormats.datetimeDisplay
      ),
    };
  };

  return (
    <VView>
      <Button onPress={onNewRecordPress}>New Record</Button>
      <DataTable
        columns={[
          ...rootDefKeys.map((keyDef) => ({
            key: Objects.camelize(new String(keyDef.props.name)),
            header: NodeDefs.getName(keyDef),
          })),
          { key: "dateCreated", header: "Created on" },
        ]}
        rows={records.map(recordToRow)}
        onRowPress={onRowPress}
      />
    </VView>
  );
};
