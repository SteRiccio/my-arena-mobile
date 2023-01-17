import { Objects } from "@openforis/arena-core";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DataEntryActions } from "../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../state/dataEntry/selectors";

export const useNodeRendererLocalState = ({ nodeUuid }) => {
  const dispatch = useDispatch();
  const { node, validation } = DataEntrySelectors.useRecordNodeInfo({
    nodeUuid,
  });
  const [state, setState] = useState({ value: null });
  const { value } = state;

  useEffect(() => {
    if (!Objects.isEqual(value, node.value)) {
      setState((statePrev) => ({ ...statePrev, value: node.value }));
    }
  }, [node.value]);

  const updateNodeValue = useCallback(
    (valueUpdated) => {
      setState((statePrev) => ({ ...statePrev, value: valueUpdated }));

      dispatch(
        DataEntryActions.updateCurrentRecordAttribute({
          uuid: nodeUuid,
          value: valueUpdated,
        })
      );
    },
    [nodeUuid]
  );

  return {
    value,
    validation,
    updateNodeValue,
  };
};
