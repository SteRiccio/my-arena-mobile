import { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

import { Text } from "components";
import { DataEntryActions } from "state";

export const EntityButton = ({ treeNode, isCurrentEntity }) => {
  const { id: entityDefUuid, name: entityDefLabel } = treeNode;

  const dispatch = useDispatch();

  const onPress = useCallback(() => {
    dispatch(DataEntryActions.selectCurrentPageEntity({ entityDefUuid }));
    dispatch(DataEntryActions.toggleRecordPageMenuOpen);
  }, [entityDefUuid, treeNode]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: isCurrentEntity ? "bold" : "normal",
        }}
        textKey={entityDefLabel}
      />
    </TouchableOpacity>
  );
};
