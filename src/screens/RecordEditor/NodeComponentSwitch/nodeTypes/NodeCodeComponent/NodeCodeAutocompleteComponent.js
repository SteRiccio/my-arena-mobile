import React, { useCallback } from "react";

import { Autocomplete } from "components";

export const NodeCodeAutocompleteComponent = (props) => {
  const {
    itemLabelFunction,
    items,
    onItemAdd,
    onItemRemove,
    onSingleValueChange,
    selectedItems,
    multiple,
  } = props;

  const onSelectedItemsChange = useCallback(
    (selectedItemsUpdated) => {
      if (multiple) {
        const newItem = selectedItemsUpdated.find(
          (item) => !selectedItems.includes(item)
        );
        const removedItem = selectedItems.find(
          (item) => !selectedItemsUpdated.includes(item)
        );
        if (removedItem) {
          onItemRemove(removedItem.uuid);
        }
        if (newItem) {
          onItemAdd(newItem.uuid);
        }
      } else {
        const selectedItem = selectedItemsUpdated[0];
        onSingleValueChange(selectedItem?.uuid);
      }
    },
    [onItemAdd, onItemRemove, selectedItems, multiple]
  );

  return (
    <Autocomplete
      itemKeyExtractor={(item) => item?.uuid}
      itemLabelExtractor={itemLabelFunction}
      items={items}
      multiple={multiple}
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedItems}
    />
  );
};
