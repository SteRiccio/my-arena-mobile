import { NodeDefs } from "@openforis/arena-core";

import { NodeCodeSingleRadioComponent } from "./NodeCodeSingleRadioComponent";
import { NodeCodeMultipleCheckboxComponent } from "./NodeCodeMultipleCheckboxComponent";
import { useNodeCodeComponentLocalState } from "./useNodeCodeComponentLocalState";
import { NodeCodeAutocompleteComponent } from "./NodeCodeAutocompleteComponent";
import { DataEntrySelectors } from "state/dataEntry";
import { SurveySelectors } from "state/survey";
import { NodeCodeReadOnlyValue } from "./NodeCodeReadOnlyValue";

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

  const cycle = DataEntrySelectors.useRecordCycle();
  const isNodeDefEnumerator = SurveySelectors.useIsNodeDefEnumerator(nodeDef);
  const editable = !NodeDefs.isReadOnly(nodeDef) && !isNodeDefEnumerator;

  if (!editable) {
    return (
      <NodeCodeReadOnlyValue
        nodeDef={nodeDef}
        itemLabelFunction={itemLabelFunction}
        selectedItems={selectedItems}
      />
    );
  }

  if (
    items.length > MAX_VISIBLE_ITEMS ||
    NodeDefs.getLayoutRenderType(cycle)(nodeDef) === "dropdown"
  ) {
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
