import { useCallback } from "react";
import PropTypes from "prop-types";

import { Button, HView, Icon } from "components";
import { useIsTextDirectionRtl } from "localization";

import styles from "./styles";

const Separator = () => {
  const irRtl = useIsTextDirectionRtl();
  const iconSource = irRtl ? "less-than" : "greater-than";
  return <Icon source={iconSource} />;
};

export const BreadcrumbItem = (props) => {
  const { isLastItem = false, item, onItemPress: onItemPressProp } = props;

  const irRtl = useIsTextDirectionRtl();

  const onItemPress = useCallback(
    () => onItemPressProp(item),
    [item, onItemPressProp]
  );

  return (
    <HView
      style={[styles.item, irRtl ? styles.itemRtl : undefined]}
      transparent
    >
      <Button
        color={isLastItem ? "primary" : "secondary"}
        compact
        labelStyle={styles.itemButtonLabel}
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
