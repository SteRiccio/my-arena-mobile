import { Objects } from "@openforis/arena-core";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DataEntryActions } from "../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../state/dataEntry/selectors";

export const useNodeComponentLocalState = ({ nodeUuid }) => {
  const dispatch = useDispatch();

  const { value: nodeValue, validation } =
    DataEntrySelectors.useRecordAttributeInfo({
      nodeUuid,
    });

  const [state, setState] = useState({ value: null });
  const { value } = state;

  useEffect(() => {
    if (!Objects.isEqual(value, nodeValue)) {
      setState((statePrev) => ({ ...statePrev, value: nodeValue }));
    }
  }, [nodeValue]);

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
