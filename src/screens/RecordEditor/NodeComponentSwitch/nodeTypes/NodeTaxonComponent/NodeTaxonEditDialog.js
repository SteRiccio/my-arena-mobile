import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { NodeEditDialogInternal } from "../NodeEditDialogInternal";
import { NodeTaxonAutocomplete } from "./NodeTaxonAutocomplete";

export const NodeTaxonEditDialog = (props) => {
  const {
    nodeDef,
    onDismiss,
    parentNodeUuid,
    selectedTaxon,
    taxa,
    updateNodeValue: updateNodeValueProp,
  } = props;

  const updateNodeValue = useCallback(
    ({ value: valueNext }) => {
      updateNodeValueProp({ value: valueNext });
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
        nodeDef={nodeDef}
        selectedTaxon={selectedTaxon}
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
  selectedTaxon: PropTypes.object,
  taxa: PropTypes.array.isRequired,
  updateNodeValue: PropTypes.func.isRequired,
};
