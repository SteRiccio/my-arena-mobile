import { useCallback, useMemo } from "react";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { HView, Icon, Text } from "components";
import { DataEntryActions } from "state";

import styles from "./EntityButtonStyles";

export const EntityButton = (props) => {
  const { treeNode, isCurrentEntity } = props;
  const { label, entityPointer, hasErrors, hasWarnings } = treeNode;

  const dispatch = useDispatch();

  const onPress = useCallback(() => {
    dispatch(DataEntryActions.selectCurrentPageEntity(entityPointer));
  }, [dispatch, entityPointer]);

  const alertIconColor = useMemo(() => {
    if (hasErrors) return "darkred";
    if (hasWarnings) return "orange";
    return undefined;
  }, [hasErrors, hasWarnings]);

  const textStyle = useMemo(
    () => [
      styles.entityButtonText,
      isCurrentEntity
        ? styles.entityButtonCurrentEntityText
        : styles.entityButtonNonCurrentEntityText,
    ],
    [isCurrentEntity]
  );

  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
      <HView style={styles.entityButtonContent} transparent>
        <Text style={textStyle} textKey={label} />
        {alertIconColor && <Icon color={alertIconColor} source="alert" />}
      </HView>
    </TouchableOpacity>
  );
};

EntityButton.propTypes = {
  treeNode: PropTypes.object.isRequired,
  isCurrentEntity: PropTypes.bool,
};
