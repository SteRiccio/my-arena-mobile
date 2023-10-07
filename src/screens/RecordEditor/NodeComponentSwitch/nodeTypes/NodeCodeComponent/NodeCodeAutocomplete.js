import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { Autocomplete } from "components";

export const NodeCodeAutocomplete = (props) => {
  const {
    itemLabelFunction,
    items,
    focusOnMount,
    multiple,
    onFocus,
    onItemAdd,
    onItemRemove,
    onSingleValueChange,
    selectedItems,
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
      focusOnMount={focusOnMount}
      itemKeyExtractor={(item) => item?.uuid}
      itemLabelExtractor={itemLabelFunction}
      items={items}
      multiple={multiple}
      onFocus={onFocus}
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedItems}
    />
  );
};

NodeCodeAutocomplete.propTypes = {
  itemLabelFunction: PropTypes.func.isRequired,
  items: PropTypes.array,
  focusOnMount: PropTypes.bool,
  multiple: PropTypes.bool,
  onFocus: PropTypes.func,
  onItemAdd: PropTypes.func.isRequired,
  onItemRemove: PropTypes.func.isRequired,
  onSingleValueChange: PropTypes.func.isRequired,
  selectedItems: PropTypes.array,
};

NodeCodeAutocomplete.defaultProps = {
  items: [],
  focusOnMount: false,
  multiple: false,
  selectedItems: [],
};
