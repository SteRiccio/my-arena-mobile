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
    fields,
    items,
    onItemPress: onItemPressProp,
    onItemLongPress: onItemLongPressProp,
    onSelectionChange,
    onDeleteSelectedItemIds,
    selectable,
    selectedItemIds: selectedItemIdsProp,
    selectedItemsCustomActions,
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
    selectedItemIds: selectedItemIdsProp,
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
        customActions={selectedItemsCustomActions}
      />
      <RNPDataTable style={{ flex: 1 }}>
        <RNPDataTable.Header>
          {fields.map((field) => (
            <RNPDataTable.Title
              key={field.key}
              style={[{ flex: 1 }, field.style]}
              textStyle={{ fontWeight: "bold", fontSize: 15 }}
            >
              {t(field.header)}
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
              {fields.map(({ key: fieldKey, style, cellRenderer = null }) => (
                <RNPDataTable.Cell
                  key={fieldKey}
                  style={style}
                  textStyle={{ flex: 1 }}
                >
                  {cellRenderer ? cellRenderer({ item }) : item[fieldKey]}
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
  fields: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  onItemPress: PropTypes.func,
  onItemLongPress: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onDeleteSelectedItemIds: PropTypes.func,
  selectable: PropTypes.bool,
  selectedItemsCustomActions: PropTypes.array,
  showPagination: PropTypes.bool,
};

DataTable.defaultProps = {
  selectable: false,
  selectedItemsCustomActions: [],
  showPagination: false,
};
