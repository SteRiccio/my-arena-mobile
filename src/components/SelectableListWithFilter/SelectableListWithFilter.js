import { useCallback, useEffect, useRef, useState } from "react";
import { Chip } from "react-native-paper";
import PropTypes from "prop-types";

import { Arrays, Objects } from "@openforis/arena-core";

import { Button, IconButton, Text, TextInput, VView, View } from "components";
import { SelectableList } from "./SelectableList";

import styles from "./styles";

const _objToArray = (obj) => {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return [obj];
};

export const SelectableListWithFilter = (props) => {
  const {
    editable,
    filterItems,
    itemKeyExtractor,
    itemLabelExtractor,
    itemDescriptionExtractor,
    items,
    itemsCountToShowFilter,
    multiple,
    onSelectedItemsChange,
    selectedItems,
  } = props;

  const inputValueRef = useRef(null);

  const filterVisible = items.length > itemsCountToShowFilter;

  const calculateItemsFiltered = useCallback(() => {
    if (!filterVisible) return items;

    const filterInputValue = inputValueRef.current;

    if (filterItems) {
      return filterItems({ items, filterInputValue });
    }
    return items.filter(
      (item) =>
        !selectedItems.includes(item) &&
        (Objects.isEmpty(filterInputValue) ||
          itemLabelExtractor(item)
            .toLocaleLowerCase()
            .includes(filterInputValue.toLocaleLowerCase()))
    );
  }, [filterItems, filterVisible, items, selectedItems]);

  const [itemsFiltered, setItemsFiltered] = useState(calculateItemsFiltered());

  const updateItemsFiltered = useCallback(() => {
    const itemsFilteredNext = calculateItemsFiltered();
    if (!Objects.isEqual(itemsFilteredNext, itemsFiltered)) {
      setItemsFiltered(itemsFilteredNext);
    }
  }, [calculateItemsFiltered, itemsFiltered]);

  const onFilterInputChange = useCallback(
    (text) => {
      inputValueRef.current = text;
      updateItemsFiltered();
    },
    [updateItemsFiltered]
  );

  const _onSelectedItemsChange = useCallback(
    (selectedItemsNext) => {
      onSelectedItemsChange(selectedItemsNext, inputValueRef.current);
    },
    [onSelectedItemsChange, updateItemsFiltered]
  );

  const onListSelectionChange = useCallback(
    (newValue) => {
      const selectedItemsNext = _objToArray(newValue);
      _onSelectedItemsChange(selectedItemsNext);
    },
    [_onSelectedItemsChange]
  );

  const onItemRemove = useCallback(
    (item) => {
      const selectedItemsNext = Arrays.removeItem(item)(selectedItems);
      _onSelectedItemsChange(selectedItemsNext);
    },
    [_onSelectedItemsChange]
  );

  useEffect(() => {
    updateItemsFiltered();
  }, [updateItemsFiltered, items, selectedItems]);

  const onClearPress = useCallback(() => {
    // dispatch(
    //   ConfirmActions.show({
    //     confirmButtonTextKey: "common:clear",
    //     messageKey: "common:confirmClearSelectedValue",
    //     messageParams: { count: multiple ? 2 : 1 },
    //     onConfirm: () => _onSelectedItemsChange([]),
    //   })
    // );
    _onSelectedItemsChange([]);
  }, [_onSelectedItemsChange]);

  return (
    <VView style={styles.container}>
      {filterVisible && (
        <>
          <View style={styles.selectedItemsContainer}>
            {selectedItems.map((item) => (
              <Chip
                key={itemKeyExtractor(item)}
                onClose={() => onItemRemove(item)}
              >
                {itemLabelExtractor(item)}
              </Chip>
            ))}
          </View>

          <Text
            variant="titleMedium"
            textKey={multiple ? "common:selectNewItems" : "common:selectAnItem"}
          />
          <TextInput
            onChange={onFilterInputChange}
            placeholder="common:filter"
          />
        </>
      )}

      <SelectableList
        editable={editable}
        itemKeyExtractor={itemKeyExtractor}
        itemLabelExtractor={itemLabelExtractor}
        itemDescriptionExtractor={itemDescriptionExtractor}
        items={itemsFiltered}
        multiple={multiple}
        onChange={onListSelectionChange}
        selectedItems={selectedItems}
        style={styles.list}
      />

      {!filterVisible && (
        <IconButton
          icon="delete"
          onPress={onClearPress}
          style={styles.clearButton}
        />
      )}
    </VView>
  );
};

SelectableListWithFilter.propTypes = {
  editable: PropTypes.bool,
  filterItems: PropTypes.func,
  itemKeyExtractor: PropTypes.func,
  itemLabelExtractor: PropTypes.func,
  itemDescriptionExtractor: PropTypes.func,
  items: PropTypes.array,
  multiple: PropTypes.bool,
  onSelectedItemsChange: PropTypes.func.isRequired,
  selectedItems: PropTypes.array,
};

SelectableListWithFilter.defaultProps = {
  editable: true,
  itemKeyExtractor: (item) => item?.key,
  itemLabelExtractor: (item) => item?.label,
  itemDescriptionExtractor: (item) => item?.description,
  items: [],
  itemsCountToShowFilter: 20,
  multiple: false,
  selectedItems: [],
};
