import React, { useCallback } from "react";
import { FlatList } from "react-native";
import { List as RNPList, RadioButton } from "react-native-paper";

import { Arrays } from "@openforis/arena-core";

import { Checkbox } from "components";

import styles from "./styles";

export const SelectableList = (props) => {
  const {
    editable,
    itemKeyExtractor,
    itemLabelExtractor,
    itemDescriptionExtractor,
    items,
    multiple,
    onChange,
    selectedItems,
    style,
  } = props;

  const onItemSelect = useCallback(
    (item) => {
      const wasSelected = selectedItems.includes(item);
      let selectedItemsNext;
      if (multiple) {
        selectedItemsNext = wasSelected
          ? Arrays.removeItem(item)(selectedItems)
          : Arrays.addItem(item)(selectedItems);
      } else {
        selectedItemsNext = wasSelected ? [] : [item];
      }
      onChange(selectedItemsNext);
    },
    [itemKeyExtractor, multiple, onChange, selectedItems]
  );

  const renderItem = useCallback(
    ({ item }) => {
      const checked = selectedItems.includes(item);
      return (
        <RNPList.Item
          disabled={!editable}
          title={itemLabelExtractor(item)}
          description={itemDescriptionExtractor(item)}
          left={() =>
            multiple ? (
              <Checkbox
                checked={checked}
                disabled={!editable}
                onPress={() => onItemSelect(item)}
              />
            ) : (
              <RadioButton.Item
                status={checked ? "checked" : "unchecked"}
                disabled={!editable}
                onPress={() => onItemSelect(item)}
              />
            )
          }
          onPress={() => onItemSelect(item)}
          removeClippedSubviews
          style={styles.item}
        />
      );
    },
    [
      editable,
      itemDescriptionExtractor,
      itemLabelExtractor,
      multiple,
      onItemSelect,
      selectedItems,
    ]
  );

  return (
    <FlatList
      data={items}
      keyExtractor={itemKeyExtractor}
      renderItem={renderItem}
      style={style}
    />
  );
};
