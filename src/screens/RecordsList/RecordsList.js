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

import { Button, DataTable, HView, Loader, Text, VView } from "components";
import { useNavigationFocus } from "hooks";
import { useTranslation } from "localization";
import { RecordService } from "service";
import { ConfirmActions, DataEntryActions, SurveySelectors } from "state";

import { SurveyLanguageDropdown } from "./SurveyLanguageDropdown";
import { RecordSyncStatusIcon } from "./RecordSyncStatusIcon";
import styles from "./styles";
import { RecordSyncStatus } from "model/RecordSyncStatus";

export const RecordsList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const survey = SurveySelectors.useCurrentSurvey();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const rootDefKeys = useMemo(() => {
    if (!survey) return [];
    const rootDef = Surveys.getNodeDefRoot({ survey });
    return Surveys.getNodeDefKeys({ survey, nodeDef: rootDef });
  }, [survey]);

  const [state, setState] = useState({
    records: [],
    syncStatusFetched: false,
    loading: true,
  });
  const { records, loading, syncStatusFetched } = state;

  const loadRecords = useCallback(async () => {
    const _records = await RecordService.fetchRecords({ survey });
    setState((statePrev) => ({
      ...statePrev,
      records: _records,
      syncStatusFetched: false,
      loading: false,
    }));
  }, [survey]);

  const loadRecordsWithSyncStatus = useCallback(async () => {
    setState((statePrev) => ({
      ...statePrev,
      loading: true,
      syncStatusFetched: false,
    }));
    const _records = await RecordService.fetchRecordsWithSyncStatus({ survey });
    setState((statePrev) => ({
      ...statePrev,
      records: _records,
      loading: false,
      syncStatusFetched: true,
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

  const onExportPress = useCallback(() => {
    const newRecordsUuids = records
      .filter((record) => record.syncStatus === RecordSyncStatus.new)
      .map((record) => record.uuid);
    dispatch(DataEntryActions.exportRecords({ recordUuids: newRecordsUuids }));
  }, [records]);

  const recordToRow = (record) => {
    const valuesByKey = rootDefKeys.reduce((acc, keyDef) => {
      const recordKeyProp = Objects.camelize(NodeDefs.getName(keyDef));
      const value = record[recordKeyProp];
      const valueFormatted = NodeValueFormatter.format({
        survey,
        nodeDef: keyDef,
        value,
        showLabel: true,
        lang,
      });
      acc[recordKeyProp] = Objects.isEmpty(valueFormatted)
        ? t("common:empty")
        : valueFormatted;
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
    <VView style={styles.container}>
      <VView style={styles.innerContainer}>
        <SurveyLanguageDropdown />
        {records.length === 0 && (
          <Text textKey="dataEntry:noRecordsFound" variant="titleMedium" />
        )}
        {records.length > 0 && (
          <DataTable
            columns={[
              ...rootDefKeys.map((keyDef) => ({
                key: Objects.camelize(NodeDefs.getName(keyDef)),
                header: NodeDefs.getLabelOrName(keyDef, lang),
              })),
              {
                key: "dateModified",
                header: "common:modifiedOn",
                style: { minWidth: 70 },
              },
              ...(syncStatusFetched
                ? [
                    {
                      key: "syncStatus",
                      header: "dataEntry:syncStatusHeader",
                      cellRenderer: RecordSyncStatusIcon,
                    },
                  ]
                : []),
            ]}
            rows={records.map(recordToRow)}
            onRowPress={onRowPress}
            onDeleteSelectedRowIds={onDeleteSelectedRowIds}
            selectable
          />
        )}
      </VView>
      <HView style={styles.bottomActionBar}>
        <Button
          onPress={onNewRecordPress}
          style={styles.newRecordButton}
          textKey="dataEntry:newRecord"
        />
        {!syncStatusFetched && records.length > 0 && (
          <Button
            onPress={loadRecordsWithSyncStatus}
            style={styles.checkSyncStatusButton}
            textKey="dataEntry:checkSyncStatus"
          />
        )}
        {syncStatusFetched && (
          <Button
            onPress={onExportPress}
            style={styles.exportButton}
            textKey="dataEntry:exportData"
          />
        )}
      </HView>
    </VView>
  );
};
