import { useCallback } from "react";
import { FlatList, TouchableHighlight } from "react-native";

import { Checkbox } from "../Checkbox";
import { FormItem } from "../FormItem";
import { HView } from "../HView";
import { VView } from "../VView";
import { ItemSelectedBanner, useSelectableList } from "../SelectableList";
import { useStyles } from "./styles";

export const DataList = (props) => {
  const {
    columns,
    items,
    onItemPress: onItemPressProp,
    onItemLongPress: onItemLongPressProp,
    onSelectionChange,
    onDeleteSelectedItemIds,
    selectable,
  } = props;

  const styles = useStyles();

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

  const renderItem = useCallback(
    ({ item, separators }) => (
      <TouchableHighlight
        onPress={() => onItemPress(item)}
        onLongPress={() => onItemLongPress(item)}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
      >
        <HView style={styles.item}>
          <VView style={{ flex: 1 }}>
            {columns.map((col) => {
              const { cellRenderer, header, key, style } = col;
              return (
                <FormItem
                  labelVariant="titleSmall"
                  textVariant="titleMedium"
                  key={key}
                  labelKey={header}
                >
                  {cellRenderer ? cellRenderer({ item }) : item[key]}
                </FormItem>
              );
            })}
          </VView>
          {selectionEnabled && (
            <Checkbox
              checked={selectedItemIds.includes(item.key)}
              onPress={() => onItemSelect(item)}
            />
          )}
        </HView>
      </TouchableHighlight>
    ),
    [columns, onItemPress, onItemLongPress]
  );

  return (
    <VView>
      <ItemSelectedBanner
        onDeleteSelected={onDeleteSelected}
        selectedItemIds={selectedItemIds}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.uuid}
        renderItem={renderItem}
      />
    </VView>
  );
};
