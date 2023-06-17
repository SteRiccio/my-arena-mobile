import { useCallback, useEffect, useState } from "react";
import { DataTable as RNPDataTable } from "react-native-paper";
import { Banner } from "react-native-paper";

import { Arrays } from "@openforis/arena-core";

import { useTranslation } from "localization";
import { Checkbox } from "./Checkbox";
import { VView } from "./VView";
import { ScrollView } from "react-native";

export const DataTable = (props) => {
  const {
    columns,
    rows,
    onRowPress,
    onSelectionChange,
    onDeleteSelectedRowIds,
    selectable,
  } = props;

  const { t } = useTranslation();

  const [state, setState] = useState({ selectedRowIds: [] });

  const { selectedRowIds } = state;

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
          {selectable && (
            <RNPDataTable.Title style={{ maxWidth: 40, minWidth: 40 }} />
          )}
        </RNPDataTable.Header>
        <ScrollView persistentScrollbar>
          {rows.map((row) => (
            <RNPDataTable.Row key={row.key} onPress={() => onRowPress?.(row)}>
              {columns.map(({ key: columnKey, style, cellRenderer = null }) => (
                <RNPDataTable.Cell key={columnKey} style={style}>
                  {cellRenderer ? cellRenderer({ row }) : row[columnKey]}
                </RNPDataTable.Cell>
              ))}
              {selectable && (
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
