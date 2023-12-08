import { DataTable as RNPDataTable } from "react-native-paper";
import PropTypes from "prop-types";

import { useTranslation } from "localization";
import { Checkbox } from "../Checkbox";
import { ScrollView } from "../ScrollView";
import { VView } from "../VView";
import { usePagination } from "./usePagination";
import { ItemSelectedBanner, useSelectableList } from "../SelectableList";

export const DataTable = (props) => {
  const {
    columns,
    items,
    onItemPress: onItemPressProp,
    onItemLongPress: onItemLongPressProp,
    onSelectionChange,
    onDeleteSelectedItemIds,
    selectable,
    showPagination,
  } = props;

  const { t } = useTranslation();

  const {
    onDeleteSelected,
    onItemPress,
    onItemLongPress,
    onItemSelect,
    selectedItemIds,
    selectionEnabled,
  } = useSelectableList({
    onDeleteSelectedItemIds,
    onItemPress: onItemPressProp,
    onItemLongPress: onItemLongPressProp,
    onSelectionChange,
    selectable,
  });

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
  } = usePagination({ items: items });

  const visibleRows = showPagination ? visibleItems : items;

  return (
    <VView style={{ flex: 1 }}>
      <ItemSelectedBanner
        onDeleteSelected={onDeleteSelected}
        selectedItemIds={selectedItemIds}
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
          {visibleRows.map((item) => (
            <RNPDataTable.Row
              key={item.key}
              onPress={() => onItemPress(item)}
              onLongPress={() => onItemLongPress(item)}
            >
              {columns.map(({ key: columnKey, style, cellRenderer = null }) => (
                <RNPDataTable.Cell
                  key={columnKey}
                  style={style}
                  textStyle={{ flex: 1 }}
                >
                  {cellRenderer ? cellRenderer({ item }) : item[columnKey]}
                </RNPDataTable.Cell>
              ))}
              {selectionEnabled && (
                <RNPDataTable.Cell style={{ maxWidth: 40, minWidth: 40 }}>
                  <Checkbox
                    checked={selectedItemIds.includes(item.key)}
                    onPress={() => onItemSelect(item)}
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
              of: items.length,
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

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  onItemPress: PropTypes.func,
  onItemLongPress: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onDeleteSelectedItemIds: PropTypes.func,
  selectable: PropTypes.bool,
  showPagination: PropTypes.bool,
};

DataTable.defaultProps = {
  selectable: false,
  showPagination: false,
};
