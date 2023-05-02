import { NodeDefs, NodeValues } from "@openforis/arena-core";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { DataEntryActions } from "../../../../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../../../../state/dataEntry/selectors";

export const useNodeCodeComponentLocalState = ({ parentNodeUuid, nodeDef }) => {
  const dispatch = useDispatch();

  const { nodes } = DataEntrySelectors.useRecordChildNodes({
    parentEntityUuid: parentNodeUuid,
    nodeDef,
  });

  const onItemAdd = useCallback(
    (itemUuid) => {
      const value = NodeValues.newCodeValue({ itemUuid });
      if (NodeDefs.isSingle(nodeDef)) {
        const node = nodes[0];
        dispatch(
          DataEntryActions.updateAttribute({
            uuid: node.uuid,
            value,
          })
        );
      } else {
        dispatch(
          DataEntryActions.addNewAttribute({
            nodeDef,
            parentNodeUuid,
            value,
          })
        );
      }
    },
    [nodeDef, nodes]
  );

  const onItemRemove = useCallback(
    (itemUuid) => {
      if (NodeDefs.isSingle(nodeDef)) {
        const node = nodes[0];
        dispatch(
          DataEntryActions.updateAttribute({
            uuid: node.uuid,
            value: null,
          })
        );
      } else {
        const nodeToRemove = nodes.find(
          (node) => NodeValues.getItemUuid(node) === itemUuid
        );
        dispatch(DataEntryActions.deleteNodes([nodeToRemove.uuid]));
      }
    },
    [nodeDef, nodes]
  );

  return {
    nodes,
    onItemAdd,
    onItemRemove,
  };
};
