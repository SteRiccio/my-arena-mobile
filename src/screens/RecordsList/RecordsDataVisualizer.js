import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";

import {
  DateFormats,
  Dates,
  NodeDefs,
  NodeValueFormatter,
  Objects,
  Surveys,
} from "@openforis/arena-core";

import { DataVisualizer, LoadingIcon } from "components";

import { useTranslation } from "localization";
import {
  ConfirmActions,
  DataEntryActions,
  ScreenOptionsSelectors,
  SurveySelectors,
} from "state";

import { RecordSyncStatusIcon } from "./RecordSyncStatusIcon";

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

  const rootDefKeys = useMemo(() => {
    if (!survey) return [];
    const rootDef = Surveys.getNodeDefRoot({ survey });
    return Surveys.getNodeDefKeys({ survey, cycle, nodeDef: rootDef });
  }, [survey, cycle]);

  const recordToItem = useCallback(
    (record) => {
      const valuesByKey = rootDefKeys.reduce((acc, keyDef) => {
        const recordKeyProp = Objects.camelize(NodeDefs.getName(keyDef));
        const value = record[recordKeyProp];
        let valueFormatted = NodeValueFormatter.format({
          survey,
          nodeDef: keyDef,
          value,
          showLabel: true,
          lang,
        });
        if (Objects.isEmpty(valueFormatted)) {
          valueFormatted = Objects.isEmpty(value)
            ? t("common:empty")
            : String(value);
        }
        acc[recordKeyProp] = valueFormatted;
        return acc;
      }, {});

      return {
        ...record,
        key: record.uuid,
        ...valuesByKey,
        dateCreated: formatDateToDateTimeDisplay(record.dateCreated),
        dateModified: formatDateToDateTimeDisplay(record.dateModified),
      };
    },
    [lang, rootDefKeys]
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

  return (
    <DataVisualizer
      fields={fields}
      mode={screenViewMode}
      items={recordItems}
      onItemPress={onItemPress}
      onDeleteSelectedItemIds={onDeleteSelectedItemIds}
      selectable
    />
  );
};

RecordsDataVisualizer.propTypes = {
  loadRecords: PropTypes.func.isRequired,
  records: PropTypes.array.isRequired,
  syncStatusFetched: PropTypes.bool,
  syncStatusLoading: PropTypes.bool,
};
