import { useCallback } from "react";
import { FlatList, TouchableHighlight } from "react-native";
import PropTypes from "prop-types";

import { Checkbox } from "../Checkbox";
import { FormItem } from "../FormItem";
import { HView } from "../HView";
import { VView } from "../VView";
import { ItemSelectedBanner, useSelectableList } from "../SelectableList";
import { useStyles } from "./styles";

export const DataList = (props) => {
  const {
    fields,
    items,
    onItemPress: onItemPressProp,
    onItemLongPress: onItemLongPressProp,
    onDeleteSelectedItemIds,
    onSelectionChange,
    selectable,
  } = props;

  const styles = useStyles();

  const {
    onDeleteSelected,
    onItemPress,
    onItemLongPress,
    onItemSelect,
    selectedItemIds,
    selectionEnabled,
  } = useSelectableList({
    onDeleteSelectedItemIds,
    onItemPress: onItemPressProp,
    onItemLongPress: onItemLongPressProp,
    onSelectionChange,
    selectable,
  });

  const renderItem = useCallback(
    ({ item, separators }) => (
      <TouchableHighlight
        onPress={() => onItemPress(item)}
        onLongPress={() => onItemLongPress(item)}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
      >
        <HView style={styles.item}>
          <VView style={{ flex: 1 }}>
            {fields.map((field) => {
              const { cellRenderer, header, key, style } = field;
              return (
                <FormItem
                  key={key}
                  labelKey={header}
                  labelVariant="titleSmall"
                  style={style}
                  textVariant="titleMedium"
                >
                  {cellRenderer ? cellRenderer({ item }) : item[key]}
                </FormItem>
              );
            })}
          </VView>
          {selectionEnabled && (
            <Checkbox
              checked={selectedItemIds.includes(item.key)}
              onPress={() => onItemSelect(item)}
            />
          )}
        </HView>
      </TouchableHighlight>
    ),
    [fields, onItemPress, onItemLongPress]
  );

  return (
    <VView>
      <ItemSelectedBanner
        onDeleteSelected={onDeleteSelected}
        selectedItemIds={selectedItemIds}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.uuid}
        renderItem={renderItem}
      />
    </VView>
  );
};

DataList.propTypes = {
  fields: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  onItemPress: PropTypes.func,
  onItemLongPress: PropTypes.func,
  onDeleteSelectedItemIds: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selectable: PropTypes.bool,
};
