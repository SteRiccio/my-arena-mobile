import { useCallback } from "react";
import PropTypes from "prop-types";

import { Button, HView, Icon } from "components";

import styles from "./styles";

const Separator = () => <Icon source="greater-than" />;

export const BreadcrumbItem = (props) => {
  const { isLastItem = false, item, onItemPress: onItemPressProp } = props;

  const onItemPress = useCallback(
    () => onItemPressProp(item),
    [item, onItemPressProp]
  );

  return (
    <HView style={styles.item} transparent>
      <Button
        avoidMultiplePress={false}
        compact
        labelStyle={styles.itemButtonLabel}
        mode={isLastItem ? "contained" : "outlined"}
        onPress={onItemPress}
        style={styles.itemButton}
        textKey={item.name}
      />
      {!isLastItem && <Separator />}
    </HView>
  );
};

BreadcrumbItem.propTypes = {
  isLastItem: PropTypes.bool,
  item: PropTypes.object.isRequired,
  onItemPress: PropTypes.func.isRequired,
};
