import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chip } from "react-native-paper";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";

import { Arrays, Objects } from "@openforis/arena-core";

import { IconButton } from "../IconButton";
import { LoadingIcon } from "../LoadingIcon";
import { Searchbar } from "../Searchbar";
import { Text } from "../Text";
import { VView } from "../VView";
import { View } from "../View";

import { SelectableList } from "../SelectableList";

import styles from "./styles";

const _objToArray = (obj) => {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return [obj];
};

export const SelectableListWithFilterAsync = (props) => {
  const {
    editable,
    filterItems,
    itemKeyExtractor,
    itemLabelExtractor,
    itemDescriptionExtractor,
    items,
    itemsCountToShowFilter,
    itemsProvider,
    maxItemsToShow,
    multiple,
    onSelectedItemsChange,
    selectedItems,
  } = props;

  const inputValueRef = useRef(null);

  const filterVisible = items.length > itemsCountToShowFilter;
  const debounceFiltering = items.length > maxItemsToShow;

  const fetchAllItems = useCallback(async () => {
    if (itemsProvider) {
      return itemsProvider.fetchItems();
    }
    return items;
  }, []);

  const calculateItemsFiltered = useCallback(async () => {
    if (!filterVisible) {
      return fetchAllItems();
    }

    const filterInputValue = inputValueRef.current;

    if (Objects.isEmpty(filterInputValue)) {
      const notSelectedItems =
        selectedItems.length === 0
          ? items
          : items.filter((item) => !selectedItems.includes(item));
      return notSelectedItems.slice(0, maxItemsToShow);
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
    loading: true,
    itemsFiltered: [],
    itemsCount: -1,
  });

  const { loading, itemsFiltered } = state;

  useEffect(() => {
    fetchAllItems()
      .then((itemsFetched) => {
        setState({
          loading: false,
          itemsFiltered: itemsFetched,
        });
      })
      .catch((e) => {
        throw e;
      });
  }, []);

  const updateItemsFiltered = useCallback(async () => {
    const itemsFilteredNext = await calculateItemsFiltered();
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
  }, [calculateItemsFiltered, debounceFiltering]);

  const updateItemsFilteredDebouced = useMemo(
    () => debounce(updateItemsFiltered, 500),
    [updateItemsFiltered]
  );

  const onFilterInputChange = useCallback(
    async (text) => {
      inputValueRef.current = text;
      if (debounceFiltering) {
        setState((statePrev) => ({
          ...statePrev,
          loading: true,
          itemsFiltered: [],
        }));
        await updateItemsFilteredDebouced();
      } else {
        await updateItemsFiltered();
      }
    },
    [debounceFiltering, updateItemsFiltered]
  );

  const _onSelectedItemsChange = useCallback(
    (selectedItemsNext) => {
      onSelectedItemsChange(selectedItemsNext, inputValueRef.current);
    },
    [onSelectedItemsChange]
  );

  const onListSelectionChange = useCallback(
    (newValue) => {
      _onSelectedItemsChange(_objToArray(newValue));
    },
    [_onSelectedItemsChange]
  );

  const onItemRemove = useCallback(
    (item) => {
      _onSelectedItemsChange(Arrays.removeItem(item)(selectedItems));
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
          <Searchbar onChange={onFilterInputChange} />

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
