import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chip } from "react-native-paper";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";

import { Arrays } from "@openforis/arena-core";
import { FilteredStaticItemsProvider } from "model/FilteredStaticItemsProvider";

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

export const SelectableListWithFilter = (props) => {
  const {
    editable,
    filterItems,
    itemKeyExtractor,
    itemLabelExtractor,
    itemDescriptionExtractor,
    items,
    itemsCountToShowFilter,
    itemsProvider: itemsProviderProp,
    maxItemsToShow,
    multiple,
    onSelectedItemsChange,
    selectedItems,
  } = props;

  const inputValueRef = useRef(null);

  const [state, setState] = useState({
    loading: true,
    itemsCount: -1,
    itemsUpdateTime: Date.now(),
  });
  const { loading, itemsCount, itemsUpdateTime } = state;

  const actualItemsProvider = useMemo(
    () =>
      itemsProviderProp ??
      new FilteredStaticItemsProvider({ items, itemLabelExtractor }),
    [items, itemsProviderProp, itemLabelExtractor]
  );

  const filterVisible = !loading && itemsCount > itemsCountToShowFilter;
  const debounceFiltering = !loading && itemsCount > maxItemsToShow;

  const updateItemsUpdateTime = useCallback(() => {
    setState((statePrev) => ({ ...statePrev, itemsUpdateTime: Date.now() }));
  }, []);

  const updateItemsUpdateTimeDebouced = useMemo(
    () => debounce(updateItemsUpdateTime, 500),
    [updateItemsUpdateTime]
  );

  const onFilterInputChange = useCallback(
    (text) => {
      inputValueRef.current = text;
      if (debounceFiltering) {
        setState((statePrev) => ({
          ...statePrev,
          loading: true,
        }));
        updateItemsUpdateTimeDebouced();
      } else {
        updateItemsUpdateTime();
      }
    },
    [debounceFiltering, updateItemsUpdateTime, updateItemsUpdateTimeDebouced]
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
    actualItemsProvider.fetchItems().then(({ count }) => {
      setState({ loading: false, itemsCount: count });
    });
  }, [actualItemsProvider]);

  const onClearPress = useCallback(() => {
    _onSelectedItemsChange([]);
  }, [_onSelectedItemsChange]);

  const itemsProvider = useMemo(() => {
    if (!itemsProviderProp) return null;

    return {
      fetchItems: async ({ offset, limit }) => {
        return itemsProviderProp.fetchItems({
          offset,
          limit,
          search: inputValueRef.current,
          excludedItems: selectedItems,
        });
      },
    };
  }, [inputValueRef, itemsProviderProp, selectedItems]);

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
        itemsUpdateTime={itemsUpdateTime}
        itemsProvider={itemsProvider}
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
  maxItemsToShow: 1000,
  multiple: false,
  selectedItems: [],
};
