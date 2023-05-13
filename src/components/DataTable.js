import { useCallback, useEffect, useState } from "react";
import { DataTable as RNPDataTable } from "react-native-paper";
import { Banner } from "react-native-paper";

import { Arrays } from "@openforis/arena-core";

import { Checkbox } from "./Checkbox";

export const DataTable = (props) => {
  const {
    columns,
    rows,
    onRowPress,
    onSelectionChange,
    onDeleteSelectedRowIds,
    selectable,
  } = props;

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
    <>
      <Banner
        actions={[
          {
            label: "Delete selected",
            onPress: onDeleteSelected,
          },
        ]}
        visible={selectedRowIds.length > 0}
      />
      <RNPDataTable>
        <RNPDataTable.Header>
          {columns.map((column) => (
            <RNPDataTable.Title key={column.key} style={{ flex: 1 }}>
              {column.header}
            </RNPDataTable.Title>
          ))}
          {selectable && <RNPDataTable.Title />}
        </RNPDataTable.Header>
        {rows.map((row) => (
          <RNPDataTable.Row key={row.key} onPress={() => onRowPress?.(row)}>
            {columns.map((column) => (
              <RNPDataTable.Cell key={column.key}>
                {row[column.key]}
              </RNPDataTable.Cell>
            ))}
            {selectable && (
              <RNPDataTable.Cell>
                <Checkbox
                  checked={selectedRowIds.includes(row.key)}
                  onPress={() => onRowSelect(row)}
                />
              </RNPDataTable.Cell>
            )}
          </RNPDataTable.Row>
        ))}
      </RNPDataTable>
    </>
  );
};

DataTable.defaultProps = {
  selectable: false,
};
