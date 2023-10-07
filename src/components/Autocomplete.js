import { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Autocomplete as RNPAutocomplete,
  AutocompleteScrollView,
} from "react-native-paper-autocomplete";
import { useTheme } from "react-native-paper";

import { useTranslation } from "localization";

const _objToArray = (obj) => {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return [obj];
};

export const Autocomplete = (props) => {
  const {
    filterOptions,
    focusOnMount,
    itemKeyExtractor,
    itemLabelExtractor,
    itemDescriptionExtractor,
    items,
    multiple,
    onFocus,
    onSelectedItemsChange,
    selectedItems,
  } = props;

  const theme = useTheme();
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const inputValueRef = useRef(null);

  const value = selectedItems;

  useEffect(() => {
    if (focusOnMount) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

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
          textColor: theme.colors.secondary,
          selectionColor: theme.colors.onSecondary,
          onChange: onInputChange,
          ref: inputRef,
        }}
        multiple={multiple}
        onChange={onChange}
        options={items}
        value={value}
      />
    </AutocompleteScrollView>
  );
};

Autocomplete.propTypes = {
  filterOptions: PropTypes.func,
  focusOnMount: PropTypes.bool,
  itemKeyExtractor: PropTypes.func,
  itemLabelExtractor: PropTypes.func,
  itemDescriptionExtractor: PropTypes.func,
  items: PropTypes.array,
  multiple: PropTypes.bool,
  onFocus: PropTypes.func,
  onSelectedItemsChange: PropTypes.func.isRequired,
  selectedItems: PropTypes.array,
};

Autocomplete.defaultProps = {
  focusOnMount: false,
  itemKeyExtractor: (item) => item?.key,
  itemLabelExtractor: (item) => item?.label,
  itemDescriptionExtractor: (item) => item?.description,
  items: [],
  multiple: false,
  selectedItems: [],
};
