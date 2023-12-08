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

import {
  Button,
  CollapsiblePanel,
  DataVisualizer,
  HView,
  Loader,
  LoadingIcon,
  MenuButton,
  Text,
  VView,
} from "components";

import { useIsNetworkConnected, useNavigationFocus, useScreenKey } from "hooks";
import { useTranslation } from "localization";
import { RecordService } from "service";
import {
  ConfirmActions,
  DataEntryActions,
  MessageActions,
  ScreenOptionsSelectors,
  SurveySelectors,
} from "state";
import { RecordSyncStatus } from "model";

import { SurveyLanguageSelector } from "./SurveyLanguageSelector";
import { RecordSyncStatusIcon } from "./RecordSyncStatusIcon";

import styles from "./styles";

export const RecordsList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const screenViewMode = ScreenOptionsSelectors.useCurrentScreenViewMode();
  const networkAvailable = useIsNetworkConnected();
  const survey = SurveySelectors.useCurrentSurvey();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const defaultCycleKey = Surveys.getDefaultCycleKey(survey);
  const defaultCycle = String(Number(defaultCycleKey) + 1);
  const cycles = Surveys.getCycleKeys(survey);

  const rootDefKeys = useMemo(() => {
    if (!survey) return [];
    const rootDef = Surveys.getNodeDefRoot({ survey });
    return Surveys.getNodeDefKeys({ survey, nodeDef: rootDef });
  }, [survey]);

  const [state, setState] = useState({
    records: [],
    syncStatusLoading: false,
    syncStatusFetched: false,
    loading: true,
  });
  const { records, loading, syncStatusLoading, syncStatusFetched } = state;

  const loadRecords = useCallback(async () => {
    const _records = await RecordService.fetchRecords({ survey });
    setState((statePrev) => ({
      ...statePrev,
      records: _records,
      syncStatusFetched: false,
      syncStatusLoading: false,
      loading: false,
    }));
  }, [survey]);

  const loadRecordsWithSyncStatus = useCallback(async () => {
    setState((statePrev) => ({
      ...statePrev,
      syncStatusLoading: true,
      syncStatusFetched: false,
    }));
    try {
      const _records = await RecordService.fetchRecordsWithSyncStatus({
        survey,
      });
      setState((statePrev) => ({
        ...statePrev,
        records: _records,
        loading: false,
        syncStatusLoading: false,
        syncStatusFetched: true,
      }));
    } catch (error) {
      setState((statePrev) => ({
        ...statePrev,
        syncStatusLoading: false,
      }));
      dispatch(
        MessageActions.setMessage({
          content: "dataEntry:errorFetchingRecordsSyncStatus",
          contentParams: { details: String(error) },
        })
      );
    }
  }, [survey]);

  // reload records on navigation focus (e.g. going back to records list screen)
  useNavigationFocus({ onFocus: loadRecords });

  const onNewRecordPress = () => {
    setState((statePrev) => ({ ...statePrev, loading: true }));
    dispatch(DataEntryActions.createNewRecord({ navigation }));
  };

  const onItemPress = useCallback((row) => {
    dispatch(
      DataEntryActions.fetchAndEditRecord({ navigation, recordId: row.id })
    );
  }, []);

  const onDeleteSelectedItemIds = useCallback((recordUuids) => {
    dispatch(
      ConfirmActions.show({
        titleKey: "Delete records",
        messageKey: "Delete the selected records?",
        onConfirm: async () => {
          await dispatch(DataEntryActions.deleteRecords(recordUuids));
          await loadRecords();
        },
        swipeToConfirm: true,
      })
    );
  }, []);

  const onExportNewOrUpdatedRecordsPress = useCallback(() => {
    const newRecordsUuids = records
      .filter((record) =>
        [RecordSyncStatus.new, RecordSyncStatus.modifiedLocally].includes(
          record.syncStatus
        )
      )
      .map((record) => record.uuid);
    dispatch(
      DataEntryActions.exportRecords({
        recordUuids: newRecordsUuids,
        onJobComplete: () => loadRecordsWithSyncStatus(),
      })
    );
  }, [loadRecords, records]);

  const onExportAllRecordsPress = useCallback(() => {
    const recordsUuids = records.map((record) => record.uuid);
    dispatch(
      DataEntryActions.exportRecords({
        recordUuids: recordsUuids,
        onlyLocally: true,
      })
    );
  }, [records]);

  const recordToItem = (record) => {
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

    const formatDateToDateTimeDisplay = (date) =>
      typeof date === "string"
        ? Dates.convertDate({
            dateStr: date,
            formatFrom: DateFormats.datetimeStorage,
            formatTo: DateFormats.datetimeDisplay,
          })
        : Dates.format(date, DateFormats.datetimeDisplay);

    return {
      ...record,
      key: record.uuid,
      ...valuesByKey,
      dateCreated: formatDateToDateTimeDisplay(record.dateCreated),
      dateModified: formatDateToDateTimeDisplay(record.dateModified),
    };
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <VView style={styles.container}>
      <VView style={styles.innerContainer}>
        <CollapsiblePanel headerKey="dataEntry:options">
          <>
            <SurveyLanguageSelector />
            {cycles.length > 1 && (
              <HView style={styles.formItem}>
                <Text
                  style={styles.formItemLabel}
                  textKey="dataEntry:cycleForNewRecords"
                />
                <Text textKey={defaultCycle} />
              </HView>
            )}
          </>
        </CollapsiblePanel>

        {records.length === 0 && (
          <Text textKey="dataEntry:noRecordsFound" variant="titleMedium" />
        )}
        {records.length > 0 && (
          <DataVisualizer
            columns={[
              ...rootDefKeys.map((keyDef) => ({
                key: Objects.camelize(NodeDefs.getName(keyDef)),
                header: NodeDefs.getLabelOrName(keyDef, lang),
              })),
              {
                key: "dateModified",
                header: "common:modifiedOn",
                style: { minWidth: 50 },
              },
              ...(syncStatusLoading || syncStatusFetched
                ? [
                    {
                      key: "syncStatus",
                      header: "dataEntry:syncStatusHeader",
                      cellRenderer: syncStatusLoading
                        ? LoadingIcon
                        : RecordSyncStatusIcon,
                    },
                  ]
                : []),
            ]}
            mode={screenViewMode}
            items={records.map(recordToItem)}
            onItemPress={onItemPress}
            onDeleteSelectedItemIds={onDeleteSelectedItemIds}
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
        {records.length > 0 && (
          <MenuButton
            icon="download"
            items={[
              {
                key: "checkSyncStatus",
                label: "dataEntry:checkSyncStatus",
                disabled: !networkAvailable,
                onPress: loadRecordsWithSyncStatus,
              },
              {
                key: "exportNewOrUpdatedRecords",
                label: "dataEntry:exportNewOrUpdatedRecords",
                disabled: !syncStatusFetched,
                onPress: onExportNewOrUpdatedRecordsPress,
              },
              {
                key: "exportAllRecords",
                label: "dataEntry:exportAllRecordsLocally",
                onPress: onExportAllRecordsPress,
              },
            ]}
            style={styles.exportDataMenuButton}
          />
        )}
      </HView>
    </VView>
  );
};
