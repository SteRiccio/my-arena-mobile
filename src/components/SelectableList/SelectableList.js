import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, VirtualizedList } from "react-native";
import { List as RNPList } from "react-native-paper";
import PropTypes from "prop-types";

import { Arrays } from "@openforis/arena-core";

import { ListItemIcon } from "./ListItemIcon";

import styles from "./styles";
import { StaticItemsProvider } from "model/StaticItemsProvider";

const maxVisibleItems = 20;

export const SelectableList = (props) => {
  const {
    editable,
    itemKeyExtractor,
    itemLabelExtractor,
    itemDescriptionExtractor,
    items,
    itemsProvider,
    multiple,
    onChange,
    selectedItems,
    style,
  } = props;

  const asyncLoading = !items && !!itemsProvider;
  const actualItemsProvider = useMemo(
    () => itemsProvider ?? new StaticItemsProvider({ items }),
    [items, itemsProvider]
  );

  const [state, setState] = useState({
    loadedItems: [],
    loading: true,
    itemsCount: 0,
    itemsOffset: 0,
  });
  const { loading, loadedItems, itemsCount, itemsOffset } = state;

  useEffect(() => {
    actualItemsProvider
      .fetchItems({ offset: itemsOffset, limit: maxVisibleItems })
      .then(({ items: itms, count }) => {
        setState({
          loading: false,
          loadedItems: itms,
          itemsCount: count,
          itemsOffset,
        });
      });
  }, [actualItemsProvider, itemsOffset]);

  const getItemAtIndex = useCallback(
    (index) => {
      if (index >= itemsOffset && index < itemsOffset + maxVisibleItems) {
        return loadedItems?.[index];
      }
      // if (asyncLoading) {
      // } else {
      //   return loadedItems[index];
      // }
    },
    [asyncLoading, itemsOffset, loadedItems]
  );

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
    <VirtualizedList
      getItemCount={() => itemsCount}
      getItem={(_data, index) => getItemAtIndex(index)}
      initialNumToRender={10}
      keyExtractor={(childDef) => childDef.uuid}
      persistentScrollbar
      renderItem={renderItem}
      style={style}
    />
    // <FlatList
    //   data={items}
    //   keyExtractor={itemKeyExtractor}
    //   persistentScrollbar
    //   renderItem={renderItem}
    //   style={style}
    // />
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
