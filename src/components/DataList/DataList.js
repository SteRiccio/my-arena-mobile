import { useCallback } from "react";
import { FlatList } from "react-native";

import { FormItem } from "../FormItem";
import { VView } from "../VView";

export const DataList = (props) => {
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

  const renderItem = useCallback(
    ({ item }) => (
      <VView style={{ flex: 1 }}>
        {columns.map((col) => {
          const { cellRenderer, header, key, style } = col;
          return (
            <FormItem key={key} labelKey={header}>
              {cellRenderer ? cellRenderer({ row: item }) : item[key]}
            </FormItem>
          );
        })}
      </VView>
    ),
    []
  );

  return (
    <FlatList
      data={rows}
      keyExtractor={(item) => item.uuid}
      renderItem={renderItem}
    />
  );
};
