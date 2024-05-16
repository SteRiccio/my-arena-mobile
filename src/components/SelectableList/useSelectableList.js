import { useCallback, useEffect, useState } from "react";

import { Arrays } from "@openforis/arena-core";

const initialState = {
  selectionEnabled: false,
  selectedItemIds: [],
};

export const useSelectableList = (props) => {
  const {
    items,
    onItemPress: onItemPressProp,
    onItemLongPress: onItemLongPressProp,
    onSelectionChange,
    onDeleteSelectedItemIds,
    selectable,
    selectedItemIds: selectedItemIdsProp,
  } = props;

  const [state, setState] = useState({ ...initialState });

  const { selectedItemIds, selectionEnabled } = state;

  // reset state on items change
  useEffect(() => {
    setState((statePrev) => ({ ...statePrev, ...initialState }));
  }, [items]);

  // update internal selected item ids on prop change
  useEffect(() => {
    setState((statePrev) => ({
      ...statePrev,
      selectedItemIds: selectedItemIdsProp,
    }));
  }, [selectedItemIdsProp]);

  const onItemSelect = useCallback(
    (item) => {
      const { key } = item;
      const selected = !selectedItemIds.includes(key);
      const selectedItemIdsNext = selected
        ? Arrays.addItem(key)(selectedItemIds)
        : Arrays.removeItem(key)(selectedItemIds);

      setState((statePrev) => ({
        ...statePrev,
        selectionEnabled: selectedItemIdsNext.length > 0,
        selectedItemIds: selectedItemIdsNext,
      }));

      onSelectionChange?.(selectedItemIdsNext);
    },
    [selectedItemIds]
  );

  const onDeleteSelected = useCallback(() => {
    onDeleteSelectedItemIds?.(selectedItemIds);
    onSelectionChange?.([]);
    setState((statePrev) => ({ ...statePrev, ...initialState }));
  }, [selectedItemIds, onDeleteSelectedItemIds]);

  const onItemPress = useCallback(
    (item) => {
      if (selectionEnabled) {
        onItemSelect(item);
      } else {
        onItemPressProp?.(item);
      }
    },
    [onItemPressProp, onItemSelect]
  );

  const onItemLongPress = useCallback(
    (item) => {
      if (selectable) {
        onItemSelect(item);
      } else {
        onItemLongPressProp?.(item);
      }
    },
    [onItemLongPressProp, onItemSelect]
  );

  return {
    onDeleteSelected,
    onItemLongPress,
    onItemPress,
    onItemSelect,
    selectedItemIds,
    selectionEnabled,
  };
};
