import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ConfirmActions } from "./reducer";

export const useConfirm = () => {
  const dispatch = useDispatch();

  return useCallback(
    (params) =>
      new Promise((resolve, reject) => {
        try {
          dispatch(
            ConfirmActions.show({
              ...params,
              onConfirm: ({ selectedSingleChoiceValue }) =>
                resolve({ selectedSingleChoiceValue }),
              onCancel: () => resolve(false),
            })
          );
        } catch (error) {
          reject(error);
        }
      }),
    [dispatch]
  );
};
