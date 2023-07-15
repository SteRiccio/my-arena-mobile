import { useCallback, useEffect, useRef, useState } from "react";
import { Banner, DataTable as RNPDataTable } from "react-native-paper";

import { Arrays } from "@openforis/arena-core";

import { useTranslation } from "localization";
import { Checkbox } from "./Checkbox";
import { ScrollView } from "./ScrollView";
import { VView } from "./VView";

const longPressDelayMs = 1000;
const maxPressInLocationYDiff = 10;

export const DataTable = (props) => {
  const {
    columns,
    rows,
    onRowPress: onRowPressProp,
    onRowLongPress,
    onSelectionChange,
    onDeleteSelectedRowIds,
    selectable,
  } = props;

  const { t } = useTranslation();

  const [state, setState] = useState({ selectedRowIds: [] });
  const longPressTimeoutRef = useRef(null);
  const pressInLocationYRef = useRef(null);

  const { selectedRowIds, selectionEnabled } = state;

  const clearLongPressTimeout = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    setState((statePrev) => ({
      ...statePrev,
      selectedRowIds: [],
    }));

    return () => {
      clearLongPressTimeout();
    };
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

  const onRowPressIn = ({ event, row }) => {
    if (selectable) {
      pressInLocationYRef.current = event.nativeEvent.locationY;
      clearLongPressTimeout();

      longPressTimeoutRef.current = setTimeout(() => {
        longPressTimeoutRef.current = null;
        onRowSelect(row);
        onRowLongPress?.(row);
      }, longPressDelayMs);
    }
  };

  const onRowPressOut = ({ event, row }) => {
    if (longPressTimeoutRef.current) {
      // long press timeout not reached yet: only a "short" press
      clearLongPressTimeout();

      const locationYDiff = Math.abs(
        pressInLocationYRef.current - event.nativeEvent.locationY
      );
      if (locationYDiff <= maxPressInLocationYDiff) {
        if (selectionEnabled) {
          onRowSelect(row);
        } else {
          onRowPressProp?.(row);
        }
      }
    }
    pressInLocationYRef.current = null;
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
              onPressIn={(event) => onRowPressIn({ event, row })}
              onPressOut={(event) => onRowPressOut({ event, row })}
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
