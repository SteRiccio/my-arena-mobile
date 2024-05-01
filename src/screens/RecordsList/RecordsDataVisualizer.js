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
  const { loadRecords, records, syncStatusFetched, syncStatusLoading } = props;

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

    return {
      ...record,
      key: record.uuid,
      ...valuesByKey,
      dateCreated: formatDateToDateTimeDisplay(record.dateCreated),
      dateModified: formatDateToDateTimeDisplay(record.dateModified),
    };
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
    [rootDefKeys, syncStatusLoading, syncStatusFetched]
  );

  return (
    <DataVisualizer
      fields={fields}
      mode={screenViewMode}
      items={records.map(recordToItem)}
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
