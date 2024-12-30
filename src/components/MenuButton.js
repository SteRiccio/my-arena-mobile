import { useState } from "react";
import { Menu } from "react-native-paper";
import PropTypes from "prop-types";

import { textDirections, useTextDirection, useTranslation } from "localization";
import { Button } from "./Button";
import { IconButton } from "./IconButton";

const { ltr, rtl } = textDirections;

const itemStyleByTextDirection = {
  [rtl]: { alignSelf: "flex-end" },
};

export const MenuButton = (props) => {
  const { icon, items, label, style } = props;

  const { t } = useTranslation();
  const textDirection = useTextDirection();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      style={style}
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        label ? (
          <Button
            avoidMultiplePress={false}
            icon={icon}
            iconPosition={
              textDirection === textDirections.ltr ? "left" : "right"
            }
            onPress={openMenu}
            textKey={label}
          />
        ) : (
          <IconButton
            avoidMultiplePress={false}
            icon={icon}
            onPress={openMenu}
          />
        )
      }
    >
      {items.map(
        ({
          key,
          disabled,
          icon,
          label,
          onPress,
          keepMenuOpenOnPress = false,
        }) => (
          <Menu.Item
            key={key}
            disabled={disabled}
            leadingIcon={textDirection === ltr ? icon : undefined}
            onPress={() => {
              if (!keepMenuOpenOnPress) {
                closeMenu();
              }
              onPress();
            }}
            style={itemStyleByTextDirection[textDirection]}
            title={t(label)}
            trailingIcon={textDirection === rtl ? icon : undefined}
          />
        )
      )}
    </Menu>
  );
};

MenuButton.propTypes = {
  icon: PropTypes.string,
  items: PropTypes.array.isRequired,
  label: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
