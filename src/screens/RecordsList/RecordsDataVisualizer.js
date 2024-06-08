import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";

import { DateFormats, Dates, NodeDefs, Objects } from "@openforis/arena-core";

import { DataVisualizer, Icon, LoadingIcon } from "components";
import { i18n, useTranslation } from "localization";
import {
  RecordLoadStatus,
  RecordOrigin,
  ScreenViewMode,
  SurveyDefs,
} from "model";
import {
  DataEntryActions,
  ScreenOptionsSelectors,
  SurveySelectors,
} from "state";

import { RecordSyncStatusIcon } from "./RecordSyncStatusIcon";
import { RecordsUtils } from "./RecordsUtils";

const iconByLoadStatus = {
  [RecordLoadStatus.complete]: "circle-slice-8",
  [RecordLoadStatus.partial]: "circle-slice-4",
  [RecordLoadStatus.summary]: "circle-outline",
};

const iconByOrigin = {
  [RecordOrigin.local]: "cellphone",
  [RecordOrigin.remote]: "cloud-outline",
};

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
    onDeleteSelectedRecordUuids,
    onImportSelectedRecordUuids,
    records,
    showRemoteProps,
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

  // reset selected record uuids on records change
  useEffect(() => {
    setSelectedRecordUuids([]);
  }, [records]);

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
        dateModifiedRemote: formatDateToDateTimeDisplay(
          recordSummary.dateModifiedRemote
        ),
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
                return screenViewMode === ScreenViewMode.table ? (
                  <Icon source={iconByOrigin[origin]} />
                ) : (
                  t(`dataEntry:records.origin.${origin}`)
                );
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
                return screenViewMode === ScreenViewMode.table ? (
                  <Icon source={iconByLoadStatus[loadStatus]} />
                ) : (
                  t(`dataEntry:records.loadStatus.${loadStatus}`)
                );
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

  const onImportSelectedItems = useCallback(() => {
    onImportSelectedRecordUuids(selectedRecordUuids);
  }, [selectedRecordUuids, onImportSelectedRecordUuids]);

  return (
    <DataVisualizer
      fields={fields}
      mode={screenViewMode}
      items={recordItems}
      onItemPress={onItemPress}
      onDeleteSelectedItemIds={onDeleteSelectedRecordUuids}
      onSelectionChange={onSelectionChange}
      selectable
      selectedItemIds={selectedRecordUuids}
      selectedItemsCustomActions={[
        {
          label: i18n.t("dataEntry:records.importRecords.title"),
          onPress: onImportSelectedItems,
        },
      ]}
    />
  );
};

RecordsDataVisualizer.propTypes = {
  onDeleteSelectedRecordUuids: PropTypes.func.isRequired,
  onImportSelectedRecordUuids: PropTypes.func.isRequired,
  records: PropTypes.array.isRequired,
  syncStatusFetched: PropTypes.bool,
  syncStatusLoading: PropTypes.bool,
};
