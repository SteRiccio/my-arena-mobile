import { useCallback, useEffect, useState } from "react";
import { Banner, DataTable as RNPDataTable } from "react-native-paper";

import { Arrays } from "@openforis/arena-core";

import { useTranslation } from "localization";
import { Checkbox } from "./Checkbox";
import { ScrollView } from "./ScrollView";
import { VView } from "./VView";

export const DataTable = (props) => {
  const {
    columns,
    rows,
    onRowPress: onRowPressProp,
    onRowLongPress: onRowLongPressProp,
    onSelectionChange,
    onDeleteSelectedRowIds,
    selectable,
  } = props;

  const { t } = useTranslation();

  const [state, setState] = useState({ selectedRowIds: [] });

  const { selectedRowIds, selectionEnabled } = state;

  useEffect(() => {
    setState((statePrev) => ({
      ...statePrev,
      selectedRowIds: [],
    }));
  }, [rows]);

  const onRowSelect = useCallback(
    (row) => {
      const selected = !selectedRowIds.includes(row.key);
      const selectedRowIdsNext = selected
        ? Arrays.addItem(row.key)(selectedRowIds)
        : Arrays.removeItem(row.key)(selectedRowIds);

      setState((statePrev) => ({
        ...statePrev,
        selectionEnabled: selectedRowIdsNext.length > 0,
        selectedRowIds: selectedRowIdsNext,
      }));

      onSelectionChange?.(selectedRowIds);
    },
    [selectedRowIds]
  );

  const onDeleteSelected = useCallback(
    () => onDeleteSelectedRowIds?.(selectedRowIds),
    [selectedRowIds, onDeleteSelectedRowIds]
  );

  const onRowPress = useCallback(
    (row) => {
      if (selectionEnabled) {
        onRowSelect(row);
      } else {
        onRowPressProp?.(row);
      }
    },
    [onRowPressProp, onRowSelect]
  );

  const onRowLongPress = useCallback(
    (row) => {
      if (selectable) {
        onRowSelect(row);
      } else {
        onRowLongPressProp?.(row);
      }
    },
    [onRowLongPressProp, onRowSelect]
  );

  return (
    <VView style={{ flex: 1 }}>
      <Banner
        actions={[
          {
            label: "Delete selected",
            onPress: onDeleteSelected,
          },
        ]}
        visible={selectedRowIds.length > 0}
      />
      <RNPDataTable style={{ flex: 1 }}>
        <RNPDataTable.Header>
          {columns.map((column) => (
            <RNPDataTable.Title
              key={column.key}
              style={[{ flex: 1 }, column.style]}
              textStyle={{ fontWeight: "bold", fontSize: 15 }}
            >
              {t(column.header)}
            </RNPDataTable.Title>
          ))}
          {selectionEnabled && (
            <RNPDataTable.Title style={{ maxWidth: 40, minWidth: 40 }} />
          )}
        </RNPDataTable.Header>
        <ScrollView persistentScrollbar>
          {rows.map((row) => (
            <RNPDataTable.Row key={row.key}>
              {columns.map(({ key: columnKey, style, cellRenderer = null }) => (
                <RNPDataTable.Cell
                  onPress={() => onRowPress(row)}
                  onLongPress={() => onRowLongPress(row)}
                  key={columnKey}
                  style={style}
                  textStyle={{ flex: 1 }}
                >
                  {cellRenderer ? cellRenderer({ row }) : row[columnKey]}
                </RNPDataTable.Cell>
              ))}
              {selectionEnabled && (
                <RNPDataTable.Cell style={{ maxWidth: 40, minWidth: 40 }}>
                  <Checkbox
                    checked={selectedRowIds.includes(row.key)}
                    onPress={() => onRowSelect(row)}
                  />
                </RNPDataTable.Cell>
              )}
            </RNPDataTable.Row>
          ))}
        </ScrollView>
      </RNPDataTable>
    </VView>
  );
};

DataTable.defaultProps = {
  selectable: false,
};
