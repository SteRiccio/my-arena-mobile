import { useCallback } from "react";
import {
  Autocomplete as RNPAutocomplete,
  AutocompleteScrollView,
} from "react-native-paper-autocomplete";

export const Autocomplete = (props) => {
  const {
    itemKeyExtractor,
    itemLabelExtractor,
    items,
    multiple,
    onFocus,
    onSelectedItemsChange,
    selectedItems,
  } = props;

  const value = selectedItems;

  const onChange = useCallback(
    (newValue) => {
      const newSelectedItems = newValue ? [newValue] : [];
      onSelectedItemsChange(newSelectedItems);
    },
    [onSelectedItemsChange]
  );

  const getOptionLabel = useCallback(
    (item) => {
      const itms = Array.isArray(item) ? item : [item];
      return itms.map((itm) => itemLabelExtractor(itm)).join(", ");
    },
    [itemLabelExtractor]
  );

  return (
    <AutocompleteScrollView onTouchStart={onFocus}>
      <RNPAutocomplete
        getOptionLabel={getOptionLabel}
        getOptionValue={itemKeyExtractor}
        multiple={multiple}
        onChange={onChange}
        options={items}
        value={value}
      />
    </AutocompleteScrollView>
  );
};

Autocomplete.defaultProps = {
  itemKeyExtractor: (item) => item?.key,
  itemLabelExtractor: (item) => item?.label,
  multiple: false,
};
