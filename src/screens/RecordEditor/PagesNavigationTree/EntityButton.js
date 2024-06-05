import { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

import { Text } from "components";
import { DataEntryActions } from "state";

export const EntityButton = ({ treeNode, isCurrentEntity }) => {
  const { label, entityPointer } = treeNode;

  const dispatch = useDispatch();

  const onPress = useCallback(() => {
    dispatch(DataEntryActions.selectCurrentPageEntity(entityPointer));
  }, [entityPointer]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        style={{
          fontSize: isCurrentEntity ? 24 : 20,
          fontWeight: isCurrentEntity ? "bold" : "normal",
        }}
        textKey={label}
      />
    </TouchableOpacity>
  );
};
