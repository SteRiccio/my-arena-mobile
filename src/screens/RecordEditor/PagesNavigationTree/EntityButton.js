import { TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

import { HView, Icon, Text } from "components";
import { DataEntryActions } from "state";

import styles from "./EntityButtonStyles";

export const EntityButton = ({ treeNode, isCurrentEntity }) => {
  const { label, entityPointer, isNotValid } = treeNode;

  const dispatch = useDispatch();

  const onPress = useCallback(() => {
    dispatch(DataEntryActions.selectCurrentPageEntity(entityPointer));
  }, [dispatch, entityPointer]);

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

EntityButton.propTypes = {
  treeNode: PropTypes.object.isRequired,
  isCurrentEntity: PropTypes.bool,
};
