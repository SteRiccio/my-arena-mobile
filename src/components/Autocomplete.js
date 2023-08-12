import { useCallback, useRef } from "react";
import {
  Autocomplete as RNPAutocomplete,
  AutocompleteScrollView,
} from "react-native-paper-autocomplete";

import { useTranslation } from "localization";

const _objToArray = (obj) => {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return [obj];
};

export const Autocomplete = (props) => {
  const {
    filterOptions,
    itemKeyExtractor,
    itemLabelExtractor,
    itemDescriptionExtractor,
    items,
    multiple,
    onFocus,
    onSelectedItemsChange,
    selectedItems,
  } = props;

  const { t } = useTranslation();
  const inputValueRef = useRef(null);

  const value = selectedItems;

  const onChange = useCallback(
    (newValue) => {
      const newSelectedItems = _objToArray(newValue);
      onSelectedItemsChange(newSelectedItems, inputValueRef.current);
    },
    [onSelectedItemsChange]
  );

  const getOptionLabel = useCallback(
    (item) => {
      const itms = _objToArray(item);
      return itms.map((itm) => itemLabelExtractor(itm)).join(", ");
    },
    [itemLabelExtractor]
  );

  const getOptionDescription = useCallback(
    (item) => {
      const itms = _objToArray(item);
      return itms.map((itm) => itemDescriptionExtractor(itm)).join(", ");
    },
    [itemDescriptionExtractor]
  );

  const onInputChange = useCallback((event) => {
    inputValueRef.current = event.nativeEvent.text;
  }, []);

  return (
    <AutocompleteScrollView onTouchStart={onFocus}>
      <RNPAutocomplete
        filterOptions={filterOptions}
        getOptionLabel={getOptionLabel}
        getOptionDescription={getOptionDescription}
        getOptionValue={itemKeyExtractor}
        inputProps={{
          placeholder: t("common:search"),
          onChange: onInputChange,
        }}
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
  itemDescriptionExtractor: (item) => item?.description,
  multiple: false,
};
