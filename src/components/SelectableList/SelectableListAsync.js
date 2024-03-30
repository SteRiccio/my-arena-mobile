import React, { useCallback } from "react";
import { FlatList } from "react-native";
import { List as RNPList } from "react-native-paper";
import PropTypes from "prop-types";

import { Arrays } from "@openforis/arena-core";

import { ListItemIcon } from "./ListItemIcon";

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
          left={() => (
            <ListItemIcon
              multiple={multiple}
              checked={checked}
              editable={editable}
              onItemSelect={onItemSelect}
              item={item}
            />
          )}
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
      persistentScrollbar
      renderItem={renderItem}
      style={style}
    />
  );
};

SelectableList.propTypes = {
  editable: PropTypes.bool,
  itemKeyExtractor: PropTypes.func,
  itemLabelExtractor: PropTypes.func,
  itemDescriptionExtractor: PropTypes.func,
  items: PropTypes.array.isRequired,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  selectedItems: PropTypes.array,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

SelectableList.defaultProps = {
  editable: true,
  itemLabelExtractor: () => null,
  itemDescriptionExtractor: () => null,
  multiple: false,
  selectedItems: [],
};
