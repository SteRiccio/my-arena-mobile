import React, { useCallback, useMemo, useState } from "react";
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

import { Button, DataTable, Loader, Text, VView } from "components";
import { useNavigationFocus } from "hooks";
import { ConfirmActions, DataEntryActions, SurveySelectors } from "state";
import { RecordService } from "service";

export const RecordsList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const rootDefKeys = useMemo(() => {
    if (!survey) return [];
    const rootDef = Surveys.getNodeDefRoot({ survey });
    return Surveys.getNodeDefKeys({ survey, nodeDef: rootDef });
  }, [survey]);

  const [state, setState] = useState({ records: [], loading: true });
  const { records, loading } = state;

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

  const onNewRecordPress = () => {
    setState((statePrev) => ({ ...statePrev, loading: true }));
    dispatch(DataEntryActions.createNewRecord({ navigation }));
  };

  const onRowPress = useCallback((row) => {
    dispatch(
      DataEntryActions.fetchAndEditRecord({ navigation, recordId: row.id })
    );
  }, []);

  const onDeleteSelectedRowIds = useCallback((recordUuids) => {
    dispatch(
      ConfirmActions.show({
        titleKey: "Delete records",
        messageKey: "Delete the selected records?",
        onConfirm: async () => {
          await dispatch(DataEntryActions.deleteRecords(recordUuids));
          await loadRecords();
        },
      })
    );
  }, []);

  const recordToRow = (record) => {
    const valuesByKey = rootDefKeys.reduce((acc, keyDef) => {
      const recordKeyProp = Objects.camelize(keyDef.props.name);
      const value = record[recordKeyProp];
      acc[recordKeyProp] = NodeValueFormatter.format({
        survey,
        nodeDef: keyDef,
        value,
        showLabel: true,
        lang,
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

  if (loading) {
    return <Loader />;
  }

  return (
    <VView>
      <Button onPress={onNewRecordPress}>New Record</Button>
      {records.length === 0 && (
        <Text textKey="No records found" variant="titleMedium" />
      )}
      {records.length > 0 && (
        <DataTable
          columns={[
            ...rootDefKeys.map((keyDef) => ({
              key: Objects.camelize(keyDef.props.name),
              header: NodeDefs.getLabelOrName(keyDef, lang),
            })),
            {
              key: "dateModified",
              header: "Modified on",
              style: { minWidth: 70 },
            },
          ]}
          rows={records.map(recordToRow)}
          onRowPress={onRowPress}
          onDeleteSelectedRowIds={onDeleteSelectedRowIds}
          selectable
        />
      )}
    </VView>
  );
};
