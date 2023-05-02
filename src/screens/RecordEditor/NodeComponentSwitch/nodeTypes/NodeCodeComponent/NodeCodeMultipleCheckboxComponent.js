import React, { useCallback } from "react";

import { Checkbox, HView } from "../../../../../components";

import styles from "./styles";

export const NodeCodeMultipleCheckboxComponent = (props) => {
  const {
    editable,
    itemLabelFunction,
    items,
    onItemAdd,
    onItemRemove,
    selectedItems,
  } = props;

  const onItemSelect = useCallback(
    (item) => {
      const wasSelected = selectedItems.includes(item);
      if (wasSelected) {
        onItemRemove(item.uuid);
      } else {
        onItemAdd(item.uuid);
      }
    },
    [selectedItems]
  );

  return (
    <HView style={styles.container}>
      {items.map((item) => (
        <Checkbox
          key={item.uuid}
          label={itemLabelFunction(item)}
          disabled={!editable}
          checked={selectedItems.includes(item)}
          onPress={() => onItemSelect(item)}
        />
      ))}
    </HView>
  );
};
