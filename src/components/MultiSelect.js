import React, { useCallback, useMemo } from "react";
import RNMultiSelect from "react-native-multiple-select";

export const MultiSelect = (props) => {
  const {
    items: itemsProp,
    onSelectedItemsChange: onSelectedItemsChangeProp,
    selectedItems: selectedItemsProp,
    itemKeyExtractor,
    itemLabelExtractor,
    single,
  } = props;

  const itemToSelectOption = useCallback(
    (item) => ({
      key: itemKeyExtractor(item),
      name: itemLabelExtractor(item),
    }),
    [itemLabelExtractor, itemKeyExtractor]
  );

  const items = useMemo(
    () => itemsProp.map(itemToSelectOption),
    [itemsProp, itemToSelectOption]
  );

  const selectedItemsKeys = useMemo(
    () => selectedItemsProp.map((item) => itemKeyExtractor(item)),
    [selectedItemsProp, itemKeyExtractor]
  );

  const onSelectedItemsChange = (selectedItemsUuidUpdated) => {
    const selectedItemsUpdated = itemsProp.filter((item) =>
      selectedItemsUuidUpdated.includes(itemKeyExtractor(item))
    );
    onSelectedItemsChangeProp(selectedItemsUpdated);
  };

  return (
    <RNMultiSelect
      items={items}
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedItemsKeys}
      single={single}
      uniqueKey="key"
    />
  );
};

MultiSelect.defaultProps = {
  items: [],
  itemKeyExtractor: (item) => item?.key,
  itemLabelExtractor: (item) => item?.label,
  selectedItems: [],
  single: false,
};
