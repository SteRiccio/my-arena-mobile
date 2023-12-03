import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chip } from "react-native-paper";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";

import { Arrays, Objects } from "@openforis/arena-core";

import {
  IconButton,
  LoadingIcon,
  Text,
  TextInput,
  VView,
  View,
} from "components";
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
    maxItemsToShow,
    multiple,
    onSelectedItemsChange,
    selectedItems,
  } = props;

  const inputValueRef = useRef(null);

  const filterVisible = items.length > itemsCountToShowFilter;
  const debounceFiltering = items.length > maxItemsToShow;

  const calculateItemsFiltered = useCallback(() => {
    if (!filterVisible) return items;

    const filterInputValue = inputValueRef.current;

    if (Objects.isEmpty(filterInputValue)) {
      if (selectedItems.length === 0) {
        return items.slice(0, maxItemsToShow);
      } else {
        return items
          .filter((item) => !selectedItems.includes(item))
          .slice(0, maxItemsToShow);
      }
    }

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

  const [state, setState] = useState({
    loading: false,
    itemsFiltered: calculateItemsFiltered(),
  });
  const { loading, itemsFiltered } = state;

  const updateItemsFiltered = useCallback(() => {
    const itemsFilteredNext = calculateItemsFiltered();
    if (!Objects.isEqual(itemsFiltered, itemsFilteredNext)) {
      setState((statePrev) => ({
        ...statePrev,
        loading: false,
        itemsFiltered: itemsFilteredNext,
      }));
    } else if (debounceFiltering) {
      setState((statePrev) => ({
        ...statePrev,
        loading: false,
      }));
    }
  }, [calculateItemsFiltered]);

  const updateItemsFilteredDebouced = useMemo(
    () => debounce(updateItemsFiltered, 500),
    [updateItemsFiltered]
  );

  const onFilterInputChange = useCallback(
    (text) => {
      inputValueRef.current = text;
      if (debounceFiltering) {
        setState((statePrev) => ({
          ...statePrev,
          loading: true,
          itemsFiltered: [],
        }));
        updateItemsFilteredDebouced();
      } else {
        updateItemsFiltered();
      }
    },
    [updateItemsFiltered]
  );

  const _onSelectedItemsChange = useCallback(
    (selectedItemsNext) => {
      onSelectedItemsChange(selectedItemsNext, inputValueRef.current);
    },
    [onSelectedItemsChange]
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

          {(multiple || selectedItems.length === 0) && (
            <Text
              variant="titleMedium"
              textKey={
                multiple ? "common:selectNewItems" : "common:selectAnItem"
              }
            />
          )}
          <TextInput onChange={onFilterInputChange} label="common:filter" />

          {loading && <LoadingIcon />}

          {!loading && itemsFiltered.length === 0 && (
            <Text
              variant="titleMedium"
              textKey="common:noItemsMatchingSearch"
            />
          )}
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
  itemsCountToShowFilter: PropTypes.number,
  maxItemsToShow: PropTypes.number,
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
  itemsCountToShowFilter: 10,
  maxItemsToShow: 50,
  multiple: false,
  selectedItems: [],
};
