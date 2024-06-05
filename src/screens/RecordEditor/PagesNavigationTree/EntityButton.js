import { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

import { HView, Icon, Text } from "components";
import { DataEntryActions } from "state";

import styles from "./styles";

export const EntityButton = ({ treeNode, isCurrentEntity }) => {
  const { label, entityPointer, isNotValid } = treeNode;

  const dispatch = useDispatch();

  const onPress = useCallback(() => {
    dispatch(DataEntryActions.selectCurrentPageEntity(entityPointer));
  }, [entityPointer]);

  return (
    <TouchableOpacity onPress={onPress}>
      <HView style={styles.entityButtonContent} transparent>
        <Text
          style={
            isCurrentEntity
              ? styles.currentEntityButtonText
              : styles.entityButtonText
          }
          textKey={label}
        />
        {isNotValid && <Icon source="alert" />}
      </HView>
    </TouchableOpacity>
  );
};
