import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";

import {
  DateFormats,
  Dates,
  NodeDefs,
  Objects,
  Surveys,
} from "@openforis/arena-core";

import { DataVisualizer, LoadingIcon } from "components";

import { i18n, useTranslation } from "localization";
import {
  ConfirmActions,
  DataEntryActions,
  JobMonitorActions,
  ScreenOptionsSelectors,
  SurveySelectors,
} from "state";

import { RecordSyncStatusIcon } from "./RecordSyncStatusIcon";
import { RecordsUtils } from "./RecordsUtils";
import { RecordOrigin } from "model/RecordOrigin";
import { RecordService } from "service/recordService";

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
    showOrigin,
    syncStatusFetched,
    syncStatusLoading,
  } = props;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const survey = SurveySelectors.useCurrentSurvey();
  const cycle = SurveySelectors.useCurrentSurveyCycle();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const screenViewMode = ScreenOptionsSelectors.useCurrentScreenViewMode();
  const [selectedRecordUuids, setSelectedRecordUuids] = useState([]);

  const rootDefKeys = useMemo(() => {
    if (!survey) return [];
    const rootDef = Surveys.getNodeDefRoot({ survey });
    return Surveys.getNodeDefKeys({ survey, cycle, nodeDef: rootDef });
  }, [survey, cycle]);

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
      ...(showOrigin
        ? [
            {
              key: "origin",
              header: "dataEntry:records.origin",
              style: { minWidth: 10 },
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
    [rootDefKeys, showOrigin, syncStatusLoading, syncStatusFetched]
  );

  const onSelectionChange = useCallback((selection) => {
    setSelectedRecordUuids(selection);
  }, []);

  const onExportJobComplete = useCallback((job) => {
    const { outputFileName: fileName } = job.result;
    RecordService.downloadExportedRecordsFileFromRemoteServer({
      survey,
      fileName,
    })
      .then((fileUri) => {
        console.log("===downloaded", fileUri);
      })
      .catch((e) => console.log("===error", e));
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
          label: i18n.t("dataEntry:records.downloadFromServer"),
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
