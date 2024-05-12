import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";

import {
  DateFormats,
  Dates,
  JobStatus,
  NodeDefs,
  Objects,
} from "@openforis/arena-core";

import { DataVisualizer, LoadingIcon } from "components";

import { i18n, useTranslation } from "localization";
import {
  ConfirmActions,
  DataEntryActions,
  JobMonitorActions,
  RemoteConnectionSelectors,
  ScreenOptionsSelectors,
  SurveySelectors,
  ToastActions,
} from "state";

import { RecordSyncStatusIcon } from "./RecordSyncStatusIcon";
import { RecordsUtils } from "./RecordsUtils";
import { RecordOrigin, ScreenViewMode, SurveyDefs } from "model";
import { RecordService } from "service/recordService";
import { RecordsImportJob } from "service/recordsImportJob";

const formatDateToDateTimeDisplay = (date) =>
  typeof date === "string"
    ? Dates.convertDate({
        dateStr: date,
        formatFrom: DateFormats.datetimeStorage,
        formatTo: DateFormats.datetimeDisplay,
      })
    : Dates.format(date, DateFormats.datetimeDisplay);

export const RecordsDataVisualizer = (props) => {
  const {
    loadRecords,
    records,
    showRemoteProps,
    syncStatusFetched,
    syncStatusLoading,
  } = props;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const user = RemoteConnectionSelectors.useLoggedInUser();
  const survey = SurveySelectors.useCurrentSurvey();
  const cycle = SurveySelectors.useCurrentSurveyCycle();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const screenViewMode = ScreenOptionsSelectors.useCurrentScreenViewMode();
  const [selectedRecordUuids, setSelectedRecordUuids] = useState([]);

  const rootDefKeys = useMemo(
    () => (survey ? SurveyDefs.getRootKeyDefs({ survey, cycle }) : []),
    [survey, cycle]
  );

  const recordToItem = useCallback(
    (recordSummary) => {
      const valuesByKey = RecordsUtils.getValuesByKeyFormatted({
        survey,
        lang,
        recordSummary,
        t,
      });
      return {
        ...recordSummary,
        key: recordSummary.uuid,
        ...valuesByKey,
        dateCreated: formatDateToDateTimeDisplay(recordSummary.dateCreated),
        dateModified: formatDateToDateTimeDisplay(recordSummary.dateModified),
      };
    },
    [lang, survey]
  );

  const recordItems = useMemo(
    () => records.map(recordToItem),
    [records, recordToItem]
  );

  const onItemPress = useCallback((recordSummary) => {
    dispatch(
      DataEntryActions.fetchAndEditRecord({ navigation, recordSummary })
    );
  }, []);

  const onDeleteSelectedItemIds = useCallback((recordUuids) => {
    dispatch(
      ConfirmActions.show({
        titleKey: "dataEntry:records.deleteRecordsConfirm.title",
        messageKey: "dataEntry:records.deleteRecordsConfirm.message",
        onConfirm: async () => {
          await dispatch(DataEntryActions.deleteRecords(recordUuids));
          await loadRecords();
        },
        swipeToConfirm: true,
      })
    );
  }, []);

  const fields = useMemo(
    () => [
      ...rootDefKeys.map((keyDef) => ({
        key: Objects.camelize(NodeDefs.getName(keyDef)),
        header: NodeDefs.getLabelOrName(keyDef, lang),
      })),
      {
        key: "dateModified",
        header: "common:modifiedOn",
        style: { minWidth: 50 },
      },
      ...(showRemoteProps
        ? [
            {
              key: "origin",
              header: "dataEntry:records.origin.title",
              style: { minWidth: 10 },
              cellRenderer: ({ item }) => {
                const { origin } = item;
                return screenViewMode === ScreenViewMode.table
                  ? origin
                  : t(`dataEntry:records.origin.${origin}`);
              },
            },
            ...(screenViewMode === ScreenViewMode.list
              ? [
                  {
                    key: "dateModifiedRemote",
                    header: "dataEntry:records.dateModifiedRemotely",
                  },
                ]
              : []),
            {
              key: "loadStatus",
              header: "dataEntry:records.loadStatus.title",
              style: { minWidth: 10 },
              cellRenderer: ({ item }) => {
                const { loadStatus } = item;
                return screenViewMode === ScreenViewMode.table
                  ? loadStatus
                  : t(`dataEntry:records.loadStatus.${loadStatus}`);
              },
            },
          ]
        : []),
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
    ],
    [
      rootDefKeys,
      screenViewMode,
      showRemoteProps,
      syncStatusLoading,
      syncStatusFetched,
    ]
  );

  const onSelectionChange = useCallback((selection) => {
    setSelectedRecordUuids(selection);
  }, []);

  const downloadRecordsFileFromServerAndImport = async ({ fileName }) => {
    const fileUri =
      await RecordService.downloadExportedRecordsFileFromRemoteServer({
        survey,
        fileName,
      });
    const recordsImportJob = new RecordsImportJob({
      survey,
      user,
      fileUri,
    });
    await recordsImportJob.start();
    const { status, errors } = recordsImportJob.summary;
    if (status === JobStatus.succeeded) {
      dispatch(
        ToastActions.show({
          textKey: "dataEntry:records.importCompleteSuccessfully",
        })
      );
      await loadRecords();
    } else {
      dispatch(
        ToastActions.show({
          textKey: "dataEntry:records.importFailed",
          textParams: {
            details: JSON.stringify(errors),
          },
        })
      );
    }
  };

  const onExportJobComplete = useCallback((job) => {
    const { outputFileName: fileName } = job.result;
    dispatch(JobMonitorActions.close());
    downloadRecordsFileFromServerAndImport({ fileName });
  }, []);

  const onDownloadSelectedRecords = useCallback(() => {
    const selectedRecords = recordItems.filter((record) =>
      selectedRecordUuids.includes(record.uuid)
    );
    if (
      selectedRecords.every((record) => record.origin === RecordOrigin.remote)
    ) {
      RecordService.startExportRecordsFromRemoteServer({
        survey,
        cycle,
        recordUuids: selectedRecordUuids,
      }).then((job) => {
        dispatch(
          JobMonitorActions.start({
            jobUuid: job.uuid,
            titleKey: "dataEntry:records.downloadRecords.title",
            onJobComplete: onExportJobComplete,
          })
        );
      });
    }
  }, [survey, cycle, recordItems, selectedRecordUuids, onExportJobComplete]);

  return (
    <DataVisualizer
      fields={fields}
      mode={screenViewMode}
      items={recordItems}
      onItemPress={onItemPress}
      onDeleteSelectedItemIds={onDeleteSelectedItemIds}
      onSelectionChange={onSelectionChange}
      selectable
      selectedItemsCustomActions={[
        {
          label: i18n.t("dataEntry:records.downloadRecords.title"),
          onPress: onDownloadSelectedRecords,
        },
      ]}
    />
  );
};

RecordsDataVisualizer.propTypes = {
  loadRecords: PropTypes.func.isRequired,
  records: PropTypes.array.isRequired,
  syncStatusFetched: PropTypes.bool,
  syncStatusLoading: PropTypes.bool,
};
