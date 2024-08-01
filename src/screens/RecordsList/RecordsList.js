import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Dates, Objects, Surveys } from "@openforis/arena-core";

import {
  Button,
  CollapsiblePanel,
  FormItem,
  HView,
  IconButton,
  Loader,
  MenuButton,
  Searchbar,
  Switch,
  Text,
  VView,
} from "components";
import { useIsNetworkConnected, useNavigationFocus, useToast } from "hooks";
import { useTranslation } from "localization";
import {
  Cycles,
  RecordOrigin,
  RecordSyncStatus,
  RecordUpdateConflictResolutionStrategy as ConflictResolutionStrategy,
  RecordLoadStatus,
} from "model";
import { RecordService } from "service";
import {
  DataEntryActions,
  MessageActions,
  SurveySelectors,
  useConfirm,
} from "state";

import { SurveyLanguageSelector } from "./SurveyLanguageSelector";
import { RecordsDataVisualizer } from "./RecordsDataVisualizer";
import { SurveyCycleSelector } from "./SurveyCycleSelector";
import { RecordsUtils } from "./RecordsUtils";

import styles from "./styles";

const minRecordsToShowSearchBar = 5;
const noRecordsToExportTextKey =
  "dataEntry:exportData.noRecordsInDeviceToExport";

export const RecordsList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const networkAvailable = useIsNetworkConnected();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const survey = SurveySelectors.useCurrentSurvey();
  const cycle = SurveySelectors.useCurrentSurveyCycle();
  const toaster = useToast();
  const confirm = useConfirm();

  const defaultCycleKey = Surveys.getDefaultCycleKey(survey);
  const defaultCycleText = Cycles.labelFunction(defaultCycleKey);
  const cycles = Surveys.getCycleKeys(survey);

  const [state, setState] = useState({
    loading: true,
    onlyLocal: true,
    records: [],
    searchValue: "",
    syncStatusLoading: false,
    syncStatusFetched: false,
  });
  const {
    loading,
    onlyLocal,
    records,
    searchValue,
    syncStatusLoading,
    syncStatusFetched,
  } = state;

  const loadRecords = useCallback(async () => {
    setState((statePrev) => ({ ...statePrev, loading: true }));

    const _records = await RecordService.fetchRecords({
      survey,
      cycle,
      onlyLocal,
    });

    setState((statePrev) => ({
      ...statePrev,
      searchValue: "",
      records: _records,
      syncStatusFetched: false,
      syncStatusLoading: false,
      loading: false,
    }));
  }, [survey, cycle, onlyLocal]);

  // refresh records list on cycle and "only local" change
  useEffect(() => {
    loadRecords();
  }, [cycle, loadRecords, onlyLocal]);

  // refresh records list on navigation focus (e.g. going back to records list screen)
  useNavigationFocus({ onFocus: loadRecords });

  const loadRecordsWithSyncStatus = useCallback(async () => {
    setState((statePrev) => ({
      ...statePrev,
      syncStatusLoading: true,
      syncStatusFetched: false,
    }));
    try {
      const _records = await RecordService.syncRecordSummaries({
        survey,
        cycle,
        onlyLocal,
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
  }, [survey, cycle, onlyLocal]);

  const onOnlyLocalChange = useCallback(
    (onlyLocalUpdated) =>
      setState((statePrev) => ({ ...statePrev, onlyLocal: onlyLocalUpdated })),
    []
  );

  const onSearchValueChange = useCallback(
    (searchValueUpdated) =>
      setState((statePrev) => ({
        ...statePrev,
        searchValue: searchValueUpdated,
      })),
    []
  );

  const onRemoteSyncPress = useCallback(async () => {
    await loadRecordsWithSyncStatus();
  }, [loadRecordsWithSyncStatus]);

  const onNewRecordPress = () => {
    setState((statePrev) => ({ ...statePrev, loading: true }));
    dispatch(DataEntryActions.createNewRecord({ navigation }));
  };

  const confirmExportRecords = useCallback(async ({ records }) => {
    const getRecordsByStatus = (status) =>
      records.filter((r) => r.syncStatus === status);
    const newRecords = getRecordsByStatus(RecordSyncStatus.new);
    const newRecordsCount = newRecords.length;

    const updatedRecords = getRecordsByStatus(RecordSyncStatus.modifiedLocally);
    const updatedRecordsCount = updatedRecords.length;

    const conflictingRecords = getRecordsByStatus(
      RecordSyncStatus.conflictingKeys
    );
    const conflictingRecordsCount = conflictingRecords.length;

    if (newRecordsCount + updatedRecordsCount + conflictingRecordsCount === 0) {
      toaster.show(noRecordsToExportTextKey);
      return { confirmResult: false };
    }
    const confirmSingleChoiceOptions =
      conflictingRecordsCount > 0
        ? [
            {
              value: ConflictResolutionStrategy.overwriteIfUpdated,
              label: "dataEntry:exportData.onlyNewOrUpdatedRecords",
            },
            {
              value: ConflictResolutionStrategy.merge,
              label: "dataEntry:exportData.mergeConflictingRecords",
            },
          ]
        : [];
    const confirmResult = await confirm({
      titleKey: "dataEntry:exportData.confirm.title",
      messageKey: "dataEntry:exportData.confirm.message",
      messageParams: {
        newRecordsCount,
        updatedRecordsCount,
        conflictingRecordsCount,
      },
      confirmButtonTextKey: "dataEntry:exportData.title",
      singleChoiceOptions: confirmSingleChoiceOptions,
      defaultSingleChoiceValue: confirmSingleChoiceOptions[0]?.value,
    });
    return { newRecords, updatedRecords, conflictingRecords, confirmResult };
  }, []);

  const exportSelectedRecords = useCallback(
    async (selectedRecords) => {
      const { newRecords, updatedRecords, conflictingRecords, confirmResult } =
        await confirmExportRecords({ records: selectedRecords });
      if (confirmResult) {
        const recordsToExport = [...newRecords, ...updatedRecords];

        let conflictResolutionStrategy =
          ConflictResolutionStrategy.overwriteIfUpdated;
        if (
          confirmResult.selectedSingleChoiceValue ===
          ConflictResolutionStrategy.merge
        ) {
          recordsToExport.push(...conflictingRecords);
          conflictResolutionStrategy = ConflictResolutionStrategy.merge;
        }
        const recordUuids = recordsToExport.map((r) => r.uuid);
        if (recordUuids.length === 0) {
          toaster.show(noRecordsToExportTextKey);
          return;
        }
        dispatch(
          DataEntryActions.exportRecords({
            cycle,
            recordUuids,
            conflictResolutionStrategy,
            onJobComplete: loadRecordsWithSyncStatus,
          })
        );
      }
    },
    [confirmExportRecords, cycle, loadRecordsWithSyncStatus]
  );

  const onExportNewOrUpdatedRecordsPress = useCallback(async () => {
    await exportSelectedRecords(records);
  }, [cycle, exportSelectedRecords, records]);

  const onExportAllRecordsPress = useCallback(() => {
    const recordUuids = records
      .filter((record) => record.origin === RecordOrigin.local)
      .map((record) => record.uuid);

    if (recordUuids.length === 0) {
      toaster.show(noRecordsToExportTextKey);
      return;
    }
    dispatch(
      DataEntryActions.exportRecords({ cycle, recordUuids, onlyLocally: true })
    );
  }, [cycle, records]);

  const onExportSelectedRecordUuids = useCallback(
    async (recordUuids) => {
      const selectedRecords = records.filter((record) =>
        recordUuids.includes(record.uuid)
      );
      await exportSelectedRecords(selectedRecords);
    },
    [cycle, exportSelectedRecords, records]
  );

  const onDeleteSelectedRecordUuids = useCallback(
    async (recordUuids) => {
      if (
        await confirm({
          titleKey: "dataEntry:records.deleteRecordsConfirm.title",
          messageKey: "dataEntry:records.deleteRecordsConfirm.message",
          swipeToConfirm: true,
        })
      ) {
        await dispatch(DataEntryActions.deleteRecords(recordUuids));
        await loadRecords();
      }
    },
    [confirm, dispatch, loadRecords]
  );

  const checkRecordsCanBeImported = useCallback(
    (selectedRecords) => {
      const selectedLocalRecords = selectedRecords.filter(
        (record) => record.origin === RecordOrigin.local
      );
      if (
        selectedLocalRecords.length > 0 &&
        selectedLocalRecords.some((record) => {
          const { dateModified, dateModifiedRemote, dateSynced } = record;
          return (
            !dateSynced || !Dates.isAfter(dateModifiedRemote, dateModified)
          );
        })
      ) {
        toaster.show(
          "dataEntry:exportData.onlyRecordsInRemoteServerCanBeImported"
        );
        return false;
      }
      return true;
    },
    [toaster]
  );

  const onImportSelectedRecordUuids = useCallback(
    (selectedRecordUuids) => {
      const selectedRecords = records.filter((record) =>
        selectedRecordUuids.includes(record.uuid)
      );
      if (!checkRecordsCanBeImported(selectedRecords)) {
        return;
      }
      dispatch(
        DataEntryActions.importRecordsFromServer({
          recordUuids: selectedRecordUuids,
          onImportComplete: loadRecords,
        })
      );
    },
    [checkRecordsCanBeImported, dispatch, loadRecords, records]
  );

  const checkRecordsCanBeCloned = useCallback(
    (selectedRecords) => {
      const selectedRemoteRecords = selectedRecords.filter(
        (record) => record.origin === RecordOrigin.remote
      );
      if (
        selectedRemoteRecords.length > 0 &&
        selectedRemoteRecords.some(
          (record) => record.loadStatus !== RecordLoadStatus.complete
        )
      ) {
        toaster.show(
          "dataEntry:records.cloneRecords.onlyRecordsImportedInDeviceOrModifiedLocallyCanBeCloned"
        );
        return false;
      }
      return true;
    },
    [toaster]
  );

  const onCloneSelectedRecordUuids = useCallback(
    (selectedRecordUuids) => {
      const selectedRecords = records.filter((record) =>
        selectedRecordUuids.includes(record.uuid)
      );
      if (!checkRecordsCanBeCloned(selectedRecords)) {
        return;
      }
      dispatch(
        DataEntryActions.cloneRecordsIntoDefaultCycle({
          recordSummaries: selectedRecords,
          callback: loadRecords,
        })
      );
    },
    [checkRecordsCanBeCloned, dispatch, loadRecords, records]
  );

  const recordsFiltered = useMemo(() => {
    if (Objects.isEmpty(searchValue)) return records;

    return records.filter((recordSummary) => {
      const valuesByKey = RecordsUtils.getValuesByKeyFormatted({
        survey,
        lang,
        recordSummary,
        t,
      });
      const searchValueLowerCase = searchValue.toLocaleLowerCase();
      return Object.values(valuesByKey).some(
        (value) =>
          !Objects.isEmpty(value) &&
          String(value).toLocaleLowerCase().includes(searchValueLowerCase)
      );
    });
  }, [survey, lang, records, searchValue]);

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
                <Text textKey={defaultCycleText} />
              </HView>
            )}
          </>
        </CollapsiblePanel>

        <CollapsiblePanel headerKey="dataEntry:records.listOptions">
          <>
            <FormItem
              labelKey="dataEntry:showOnlyLocalRecords"
              style={styles.formItem}
            >
              <Switch value={onlyLocal} onChange={onOnlyLocalChange} />
              <IconButton
                disabled={!networkAvailable}
                icon="cloud-refresh"
                loading={syncStatusLoading}
                onPress={onRemoteSyncPress}
              />
            </FormItem>
            {cycles.length > 1 && <SurveyCycleSelector />}
          </>
        </CollapsiblePanel>

        {loading ? (
          <Loader />
        ) : (
          <>
            {records.length > minRecordsToShowSearchBar && (
              <Searchbar value={searchValue} onChange={onSearchValueChange} />
            )}
            {records.length === 0 && (
              <Text textKey="dataEntry:noRecordsFound" variant="titleMedium" />
            )}
            {records.length > 0 && (
              <RecordsDataVisualizer
                loadRecords={loadRecords}
                onCloneSelectedRecordUuids={onCloneSelectedRecordUuids}
                onDeleteSelectedRecordUuids={onDeleteSelectedRecordUuids}
                onExportSelectedRecordUuids={onExportSelectedRecordUuids}
                onImportSelectedRecordUuids={onImportSelectedRecordUuids}
                records={recordsFiltered}
                showRemoteProps={!onlyLocal}
                syncStatusFetched={syncStatusFetched}
                syncStatusLoading={syncStatusLoading}
              />
            )}
          </>
        )}
      </VView>
      <HView style={styles.bottomActionBar}>
        {defaultCycleKey === cycle && (
          <Button
            icon="plus"
            onPress={onNewRecordPress}
            style={styles.newRecordButton}
            textKey="dataEntry:newRecord"
          />
        )}
        {records.length > 0 && (
          <MenuButton
            icon="download"
            items={[
              {
                key: "checkSyncStatus",
                keepMenuOpenOnPress: true,
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
