import { NodeDefs } from "@openforis/arena-core";

import { NodeCodeSingleRadioComponent } from "./NodeCodeSingleRadioComponent";
import { NodeCodeMultipleCheckboxComponent } from "./NodeCodeMultipleCheckboxComponent";
import { useNodeCodeComponentLocalState } from "./useNodeCodeComponentLocalState";
import { NodeCodeAutocompleteComponent } from "./NodeCodeAutocompleteComponent";

const MAX_VISIBLE_ITEMS = 10;

export const NodeCodeComponent = (props) => {
  const { parentNodeUuid, nodeDef, onFocus } = props;

  if (__DEV__) {
    console.log(`rendering NodeCodeComponent for ${NodeDefs.getName(nodeDef)}`);
  }

  const {
    itemLabelFunction,
    items,
    onItemAdd,
    onItemRemove,
    onSingleValueChange,
    selectedItems,
    selectedItemUuid,
  } = useNodeCodeComponentLocalState({
    parentNodeUuid,
    nodeDef,
  });

  const editable = !NodeDefs.isReadOnly(nodeDef);

  if (items.length > MAX_VISIBLE_ITEMS) {
    return (
      <NodeCodeAutocompleteComponent
        editable={editable}
        itemLabelFunction={itemLabelFunction}
        items={items}
        onFocus={onFocus}
        onItemAdd={onItemAdd}
        onItemRemove={onItemRemove}
        onSingleValueChange={onSingleValueChange}
        selectedItems={selectedItems}
        multiple={NodeDefs.isMultiple(nodeDef)}
      />
    );
  }
  if (NodeDefs.isSingle(nodeDef)) {
    return (
      <NodeCodeSingleRadioComponent
        editable={editable}
        itemLabelFunction={itemLabelFunction}
        items={items}
        onChange={onSingleValueChange}
        value={selectedItemUuid}
      />
    );
  }
  return (
    <NodeCodeMultipleCheckboxComponent
      editable={editable}
      itemLabelFunction={itemLabelFunction}
      items={items}
      onItemAdd={onItemAdd}
      onItemRemove={onItemRemove}
      selectedItems={selectedItems}
    />
  );
};
