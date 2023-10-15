import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { NodeEditDialogInternal } from "../NodeEditDialogInternal";
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
    <NodeEditDialogInternal
      nodeDef={nodeDef}
      onDismiss={onDismiss}
      parentNodeUuid={parentNodeUuid}
    >
      <NodeTaxonAutocomplete
        focusOnMount
        taxa={taxa}
        updateNodeValue={updateNodeValue}
      />
    </NodeEditDialogInternal>
  );
};

NodeTaxonEditDialog.propTypes = {
  nodeDef: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
  parentNodeUuid: PropTypes.string,
  taxa: PropTypes.array.isRequired,
  updateNodeValue: PropTypes.func.isRequired,
};
