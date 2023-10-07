import * as React from "react";
import PropTypes from "prop-types";

import { NodeDefs } from "@openforis/arena-core";

import { NodeCodeAutocomplete } from "./NodeCodeAutocomplete";
import { useCallback } from "react";
import { NodeEditDialog } from "../NodeEditDialog";

export const NodeCodeEditDialog = (props) => {
  const {
    editable,
    itemLabelFunction,
    items,
    nodeDef,
    onDismiss,
    onItemAdd,
    onItemRemove,
    onSingleValueChange: onSingleValueChangeProp,
    parentNodeUuid,
    selectedItems,
  } = props;

  const multiple = NodeDefs.isMultiple(nodeDef);

  const onSingleValueChange = useCallback(
    (selectedItemUuid) => {
      onSingleValueChangeProp?.(selectedItemUuid);
      if (selectedItemUuid) {
        onDismiss?.();
      }
    },
    [onDismiss, onSingleValueChangeProp]
  );

  return (
    <NodeEditDialog
      nodeDef={nodeDef}
      onDismiss={onDismiss}
      parentNodeUuid={parentNodeUuid}
    >
      <NodeCodeAutocomplete
        editable={editable}
        focusOnMount
        itemLabelFunction={itemLabelFunction}
        items={items}
        onItemAdd={onItemAdd}
        onItemRemove={onItemRemove}
        onSingleValueChange={onSingleValueChange}
        selectedItems={selectedItems}
        multiple={multiple}
      />
    </NodeEditDialog>
  );
};

NodeCodeEditDialog.propTypes = {
  editable: PropTypes.bool,
  itemLabelFunction: PropTypes.func.isRequired,
  items: PropTypes.array,
  nodeDef: PropTypes.object,
  onDismiss: PropTypes.func,
  onItemAdd: PropTypes.func.isRequired,
  onItemRemove: PropTypes.func.isRequired,
  onSingleValueChange: PropTypes.func.isRequired,
  parentNodeUuid: PropTypes.string,
  selectedItems: PropTypes.array,
};

NodeCodeEditDialog.defaultProps = {
  editable: true,
  items: [],
  multiple: false,
  selectedItems: [],
};
