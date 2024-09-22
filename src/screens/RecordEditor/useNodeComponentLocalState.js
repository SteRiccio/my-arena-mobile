import { Objects } from "@openforis/arena-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { DataEntryActions, DataEntrySelectors, StoreUtils } from "state";
import { Functions } from "utils";

const getNodeUpdateActionKey = ({ nodeUuid }) => `node_update_${nodeUuid}`;

const isNodeValueEqualDefault = (nodeValueA, nodeValueB) =>
  Objects.isEqual(nodeValueA, nodeValueB) ||
  JSON.stringify(nodeValueA) === JSON.stringify(nodeValueB) ||
  (Objects.isEmpty(nodeValueA) && Objects.isEmpty(nodeValueB));

export const useNodeComponentLocalState = ({
  nodeUuid,
  updateDelay = 0,
  uiValueToNodeValue = Functions.identity,
  nodeValueToUiValue = Functions.identity,
  isNodeValueEqual = isNodeValueEqualDefault,
}) => {
  const dispatch = useDispatch();
  const dirtyRef = useRef(false);
  const debouncedUpdateRef = useRef(null);

  const {
    applicable,
    value: nodeValue,
    validation: nodeValidation,
  } = DataEntrySelectors.useRecordAttributeInfo({
    nodeUuid,
  });

  const [state, setState] = useState({
    invalidValue: false,
    value: nodeValue,
    uiValue: nodeValueToUiValue(nodeValue),
    validation: nodeValidation,
  });
  const { invalidValue, value, uiValue, validation } = state;

  useEffect(() => {
    if (!updateDelay) return;

    const nodeValueFromUI = uiValueToNodeValue(uiValue);
    const dirty = dirtyRef.current;

    if (isNodeValueEqual(nodeValue, nodeValueFromUI)) {
      if (dirty) {
        // node value updated according to user needs: set dirty to false
        dirtyRef.current = false;
      }
    } else if (dirty) {
      // component is dirty (value being updated by the user): do not update UI using node value
    } else if (!invalidValue) {
      // UI value not in sync with node value: update UI
      const uiValueNext = nodeValueToUiValue(nodeValue);

      setState((statePrev) => ({
        ...statePrev,
        value: nodeValue,
        uiValue: uiValueNext,
        validation: nodeValidation,
      }));
    }
  }, [
    invalidValue,
    isNodeValueEqual,
    nodeValue,
    nodeValidation,
    nodeValueToUiValue,
    uiValue,
    uiValueToNodeValue,
    updateDelay,
  ]);

  const updateNodeValue = useCallback(
    async (uiValueUpdated, fileUri = null) => {
      const nodeValueUpdated = uiValueToNodeValue(uiValueUpdated);

      if (
        !Objects.isEmpty(uiValueUpdated) &&
        Objects.isEmpty(nodeValueUpdated)
      ) {
        // inserted value is not valid: do not update record, only UI
        setState((statePrev) => ({
          ...statePrev,
          invalidValue: true,
          uiValue: uiValueUpdated,
        }));
        return;
      }

      if (updateDelay) {
        dirtyRef.current = true;

        setState((statePrev) => ({
          ...statePrev,
          invalidValue: false,
          value: nodeValueUpdated,
          uiValue: uiValueUpdated,
          validation: null,
        }));

        debouncedUpdateRef.current?.cancel();

        debouncedUpdateRef.current = StoreUtils.debounceAction(
          DataEntryActions.updateAttribute({
            uuid: nodeUuid,
            value: nodeValueUpdated,
            fileUri,
          }),
          getNodeUpdateActionKey({ nodeUuid }),
          updateDelay
        );

        dispatch(debouncedUpdateRef.current);
      } else {
        dispatch(
          DataEntryActions.updateAttribute({
            uuid: nodeUuid,
            value: nodeValueUpdated,
            fileUri,
          })
        );
      }
    },
    [uiValueToNodeValue, updateDelay, nodeUuid, dispatch]
  );

  return {
    applicable,
    invalidValue,
    value: updateDelay ? value : nodeValue,
    uiValue,
    validation: updateDelay ? validation : nodeValidation,
    updateNodeValue,
    getUiValueFromState,
  };
};
