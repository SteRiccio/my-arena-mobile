import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Surveys } from "@openforis/arena-core";

import {
  Button,
  CollapsiblePanel,
  HView,
  Loader,
  MenuButton,
  Text,
  VView,
} from "components";

import { useIsNetworkConnected, useNavigationFocus } from "hooks";
import { Cycles, RecordSyncStatus } from "model";
import { RecordService } from "service";
import { DataEntryActions, MessageActions, SurveySelectors } from "state";

import { SurveyLanguageSelector } from "./SurveyLanguageSelector";
import { RecordsDataVisualizer } from "./RecordsDataVisualizer";
import styles from "./styles";
import { SurveyCycleSelector } from "./SurveyCycleSelector";

export const RecordsList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const networkAvailable = useIsNetworkConnected();
  const survey = SurveySelectors.useCurrentSurvey();
  const cycle = SurveySelectors.useCurrentSurveyCycle();
  const defaultCycleKey = Surveys.getDefaultCycleKey(survey);
  const defaultCycleText = Cycles.labelFunction(defaultCycleKey);
  const cycles = Surveys.getCycleKeys(survey);

  const [state, setState] = useState({
    records: [],
    syncStatusLoading: false,
    syncStatusFetched: false,
    loading: true,
  });
  const { records, loading, syncStatusLoading, syncStatusFetched } = state;

  const loadRecords = useCallback(async () => {
    const _records = await RecordService.fetchRecords({ survey, cycle });
    setState((statePrev) => ({
      ...statePrev,
      records: _records,
      syncStatusFetched: false,
      syncStatusLoading: false,
      loading: false,
    }));
  }, [survey, cycle]);

  // refresh records list on cycle change
  useEffect(() => {
    loadRecords();
  }, [cycle]);

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
              <>
                <HView style={styles.formItem}>
                  <Text
                    style={styles.formItemLabel}
                    textKey="dataEntry:cycleForNewRecords"
                  />
                  <Text textKey={defaultCycleText} />
                </HView>
                <SurveyCycleSelector />
              </>
            )}
          </>
        </CollapsiblePanel>

        {records.length === 0 && (
          <Text textKey="dataEntry:noRecordsFound" variant="titleMedium" />
        )}
        {records.length > 0 && (
          <RecordsDataVisualizer
            loadRecords={loadRecords}
            records={records}
            syncStatusFetched={syncStatusFetched}
            syncStatusLoading={syncStatusLoading}
          />
        )}
      </VView>
      <HView style={styles.bottomActionBar}>
        <Button
          icon="plus"
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
            label="common:export"
            style={styles.exportDataMenuButton}
          />
        )}
      </HView>
    </VView>
  );
};
