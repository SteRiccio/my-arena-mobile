import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { SelectableListWithFilter } from "components";

import { SurveySelectors } from "state/survey";

export const NodeCodeAutocomplete = (props) => {
  const {
    editable,
    itemLabelFunction,
    items,
    multiple,
    onItemAdd,
    onItemRemove,
    onSingleValueChange,
    selectedItems,
  } = props;

  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

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
    <SelectableListWithFilter
      editable={editable}
      itemKeyExtractor={(item) => item?.uuid}
      itemLabelExtractor={itemLabelFunction}
      itemDescriptionExtractor={(item) => item?.props?.descriptions?.[lang]}
      items={items}
      multiple={multiple}
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedItems}
    />
  );
};

NodeCodeAutocomplete.propTypes = {
  itemLabelFunction: PropTypes.func.isRequired,
  items: PropTypes.array,
  multiple: PropTypes.bool,
  onItemAdd: PropTypes.func.isRequired,
  onItemRemove: PropTypes.func.isRequired,
  onSingleValueChange: PropTypes.func.isRequired,
  selectedItems: PropTypes.array,
};

NodeCodeAutocomplete.defaultProps = {
  items: [],
  multiple: false,
  selectedItems: [],
};
