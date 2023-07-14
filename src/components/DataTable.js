import { useCallback, useEffect, useRef, useState } from "react";
import { Banner, DataTable as RNPDataTable } from "react-native-paper";

import { Arrays } from "@openforis/arena-core";

import { useTranslation } from "localization";
import { Checkbox } from "./Checkbox";
import { ScrollView } from "./ScrollView";
import { VView } from "./VView";

const longPressDelayMs = 1000;

export const DataTable = (props) => {
  const {
    columns,
    rows,
    onRowPress,
    onRowLongPress,
    onSelectionChange,
    onDeleteSelectedRowIds,
    selectable,
  } = props;

  const { t } = useTranslation();

  const [state, setState] = useState({ selectedRowIds: [] });
  const pressInTimeoutRef = useRef(null);

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

  const onRowPressIn = (row) => {
    if (selectable) {
      if (pressInTimeoutRef.current) {
        clearTimeout(pressInTimeoutRef.current);
      }
      pressInTimeoutRef.current = setTimeout(() => {
        pressInTimeoutRef.current = null;
        onRowSelect(row);
        onRowLongPress?.(row);
      }, longPressDelayMs);
    } else {
      onRowPress(row);
    }
  };

  const onRowPressOut = (row) => {
    if (pressInTimeoutRef.current) {
      clearTimeout(pressInTimeoutRef.current);
      onRowPress(row);
    }
  };

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
            <RNPDataTable.Row
              key={row.key}
              onPressIn={() => onRowPressIn(row)}
              onPressOut={() => onRowPressOut(row)}
            >
              {columns.map(({ key: columnKey, style, cellRenderer = null }) => (
                <RNPDataTable.Cell
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
