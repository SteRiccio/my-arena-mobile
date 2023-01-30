import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { DataEntryActions } from "../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../state/dataEntry/selectors";

export const useNodeComponentLocalState = ({ nodeUuid }) => {
  const dispatch = useDispatch();

  const {
    applicable,
    value: nodeValue,
    validation: nodeValidation,
  } = DataEntrySelectors.useRecordAttributeInfo({
    nodeUuid,
  });

  // const [state, setState] = useState({ value: null });
  // const { value, validation } = state;

  // useEffect(() => {
  //   if (!Objects.isEqual(value, nodeValue)) {
  //     setState((statePrev) => ({ ...statePrev, value: nodeValue }));
  //   }
  // }, [nodeValue]);

  const updateNodeValue = useCallback(
    (valueUpdated) => {
      // setState((statePrev) => ({ ...statePrev, value: valueUpdated }));

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
    applicable,
    value: nodeValue,
    validation: nodeValidation,
    updateNodeValue,
  };
};
