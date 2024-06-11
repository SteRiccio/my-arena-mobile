import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Objects, Surveys } from "@openforis/arena-core";

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
import { Cycles, RecordOrigin, RecordSyncStatus } from "model";
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

  const onExportNewOrUpdatedRecordsPress = useCallback(() => {
    const recordUuids = records
      .filter((record) =>
        [RecordSyncStatus.new, RecordSyncStatus.modifiedLocally].includes(
          record.syncStatus
        )
      )
      .map((record) => record.uuid);
    if (recordUuids.length === 0) {
      toaster.show("dataEntry:exportData.noRecordsInDeviceToExport");
      return;
    }
    dispatch(
      DataEntryActions.exportRecords({
        cycle,
        recordUuids,
        onJobComplete: loadRecordsWithSyncStatus,
      })
    );
  }, [cycle, loadRecordsWithSyncStatus, records]);

  const onExportAllRecordsPress = useCallback(() => {
    const recordUuids = records
      .filter((record) => record.origin === RecordOrigin.local)
      .map((record) => record.uuid);

    if (recordUuids.length === 0) {
      toaster.show("dataEntry:exportData.noRecordsInDeviceToExport");
      return;
    }
    dispatch(
      DataEntryActions.exportRecords({
        cycle,
        recordUuids,
        onlyLocally: true,
      })
    );
  }, [cycle, records]);

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
    [loadRecords]
  );

  const onImportSelectedRecordUuids = useCallback(
    (selectedRecordUuids) => {
      const selectedRecords = records.filter((record) =>
        selectedRecordUuids.includes(record.uuid)
      );
      if (
        selectedRecords.some((record) => record.origin !== RecordOrigin.remote)
      ) {
        toaster.show(
          "dataEntry:exportData.onlyRecordsInRemoteServerCanBeImported"
        );
        return;
      }
      dispatch(
        DataEntryActions.importRecordsFromServer({
          recordUuids: selectedRecordUuids,
          onImportComplete: loadRecords,
        })
      );
    },
    [dispatch, loadRecords, records, toaster]
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
      return Object.values(valuesByKey).some((value) =>
        Objects.isEmpty(value)
          ? false
          : String(value)
              .toLocaleLowerCase()
              .includes(searchValue.toLocaleLowerCase())
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
                onDeleteSelectedRecordUuids={onDeleteSelectedRecordUuids}
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
