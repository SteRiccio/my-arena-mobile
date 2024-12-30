import { useCallback } from "react";
import PropTypes from "prop-types";

import { Button, HView, Icon } from "components";

import styles from "./styles";
import {
  textDirections,
  useTextDirection,
} from "localization/useTextDirection";

const Separator = () => {
  const textDirection = useTextDirection();
  const iconSource =
    textDirection === textDirections.ltr ? "greater-than" : "less-than";
  return <Icon source={iconSource} />;
};

export const BreadcrumbItem = (props) => {
  const { isLastItem = false, item, onItemPress: onItemPressProp } = props;

  const onItemPress = useCallback(
    () => onItemPressProp(item),
    [item, onItemPressProp]
  );

  return (
    <HView style={styles.item} transparent>
      <Button
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
