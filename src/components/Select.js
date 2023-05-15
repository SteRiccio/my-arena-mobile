import React, { useCallback, useMemo } from "react";
import { PaperSelect } from "react-native-paper-select";

export const Select = (props) => {
  const {
    itemKeyExtractor,
    itemLabelExtractor,
    items,
    label,
    multiple,
    onSelectedItemsChange,
    selectedItems,
  } = props;

  const itemToOption = useCallback(
    (item) => ({
      _id: itemKeyExtractor(item),
      value: itemLabelExtractor(item),
    }),
    [itemKeyExtractor, itemLabelExtractor]
  );

  const options = useMemo(() => items.map(itemToOption), [items, itemToOption]);

  const selectedOptions = useMemo(
    () => selectedItems.map(itemToOption),
    [selectedItems, itemToOption]
  );

  const onSelection = useCallback(
    (selection) => {
      const { selectedList } = selection;
      const selectedItemsNext = selectedList.map((selectedOption) =>
        items.find((item) => itemKeyExtractor(item) === selectedOption._id)
      );
      onSelectedItemsChange(selectedItemsNext);
    },
    [onSelectedItemsChange]
  );

  return (
    <PaperSelect
      arrayList={options}
      label={label}
      multiEnable={multiple}
      onSelection={onSelection}
      selectedArrayList={selectedOptions}
      textInputMode="outlined"
    />
  );
};

Select.defaultProps = {
  items: [],
  multiple: false,
  label: null,
  itemKeyExtractor: (item) => item.uuid,
  itemLabelExtractor: (item) => item.label,
  selectedItems: [],
};
