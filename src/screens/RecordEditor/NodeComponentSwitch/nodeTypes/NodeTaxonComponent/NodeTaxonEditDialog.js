import React, { useCallback } from "react";

import { NodeEditDialog } from "../NodeEditDialog";
import { NodeTaxonAutocomplete } from "./NodeTaxonAutocomplete";

export const NodeTaxonEditDialog = (props) => {
  const {
    nodeDef,
    onDismiss,
    parentNodeUuid,
    taxa,
    updateNodeValue: updateNodeValueProp,
  } = props;

  const updateNodeValue = useCallback(
    (valueNext) => {
      updateNodeValueProp(valueNext);
      onDismiss();
    },
    [onDismiss, updateNodeValueProp]
  );

  return (
    <NodeEditDialog
      nodeDef={nodeDef}
      onDismiss={onDismiss}
      parentNodeUuid={parentNodeUuid}
    >
      <NodeTaxonAutocomplete focusOnMount taxa={taxa} updateNodeValue={updateNodeValue} />
    </NodeEditDialog>
  );
};
