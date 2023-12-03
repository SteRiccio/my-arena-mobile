import { useCallback, useEffect, useState } from "react";
import { Banner, DataTable as RNPDataTable } from "react-native-paper";

import { Arrays } from "@openforis/arena-core";

import { useTranslation } from "localization";
import { Checkbox } from "../Checkbox";
import { ScrollView } from "../ScrollView";
import { VView } from "../VView";
import { usePagination } from "./usePagination";

export const DataTable = (props) => {
  const {
    columns,
    rows,
    onRowPress: onRowPressProp,
    onRowLongPress: onRowLongPressProp,
    onSelectionChange,
    onDeleteSelectedRowIds,
    selectable,
    showPagination,
  } = props;

  const { t } = useTranslation();

  const [state, setState] = useState({
    selectedRowIds: [],
  });

  const { selectedRowIds, selectionEnabled } = state;

  useEffect(() => {
    setState((statePrev) => ({ ...statePrev, selectedRowIds: [] }));
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

  const {
    itemFrom,
    itemTo,
    itemsPerPage,
    itemsPerPageOptions,
    numberOfPages,
    page,
    visibleItems,
    onItemsPerPageChange,
    onPageChange,
  } = usePagination({ items: rows });

  const visibleRows = showPagination ? visibleItems : rows;

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
          {visibleRows.map((row) => (
            <RNPDataTable.Row
              key={row.key}
              onPress={() => onRowPress(row)}
              onLongPress={() => onRowLongPress(row)}
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
        {showPagination && (
          <RNPDataTable.Pagination
            page={page}
            numberOfPages={numberOfPages}
            onPageChange={onPageChange}
            label={t("common:fromToOf", {
              from: itemFrom + 1,
              to: itemTo,
              of: rows.length,
            })}
            numberOfItemsPerPageList={itemsPerPageOptions}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={t("common:rowsPerPage")}
          />
        )}
      </RNPDataTable>
    </VView>
  );
};

DataTable.defaultProps = {
  selectable: false,
};
