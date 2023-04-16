import { Objects } from "@openforis/arena-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { DataEntryActions } from "../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../state/dataEntry/selectors";
import { StoreUtils } from "../../state/storeUtils";

const getNodeUpdateActionKey = ({ nodeUuid }) => `node_update_${nodeUuid}`;

export const useNodeComponentLocalState = ({ nodeUuid, updateDelay = 0 }) => {
  const dispatch = useDispatch();
  const dirtyRef = useRef(false);

  const {
    applicable,
    value: nodeValue,
    validation: nodeValidation,
  } = DataEntrySelectors.useRecordAttributeInfo({
    nodeUuid,
  });

  const [state, setState] = useState({
    value: undefined,
    validation: null,
  });
  const { value, validation } = state;

  useEffect(() => {
    if (!updateDelay) return;

    if (Objects.isEqual(value, nodeValue)) {
      // node value updated according to user needs: set dirty to false
      if (dirtyRef.current) {
        dirtyRef.current = false;
      }
    } else {
      if (dirtyRef.current) {
        // component is dirty (value being updated by the user): do not update UI using node value
      } else {
        dirtyRef.current = false;
        setState((statePrev) => ({ ...statePrev, value: nodeValue }));
      }
    }
  }, [nodeValue, updateDelay]);

  const updateNodeValue = useCallback(
    async (valueUpdated) => {
      if (updateDelay) {
        dirtyRef.current = true;

        setState((statePrev) => ({ ...statePrev, value: valueUpdated }));

        dispatch(
          StoreUtils.cancelDebouncedAction(getNodeUpdateActionKey({ nodeUuid }))
        );

        dispatch(
          StoreUtils.debounceAction(
            DataEntryActions.updateCurrentRecordAttribute({
              uuid: nodeUuid,
              value: valueUpdated,
            }),
            getNodeUpdateActionKey({ nodeUuid }),
            updateDelay
          )
        );
      } else {
        dispatch(
          DataEntryActions.updateCurrentRecordAttribute({
            uuid: nodeUuid,
            value: valueUpdated,
          })
        );
      }
    },
    [nodeUuid]
  );

  return {
    applicable,
    value: updateDelay ? value : nodeValue,
    validation: nodeValidation,
    updateNodeValue,
  };
};
