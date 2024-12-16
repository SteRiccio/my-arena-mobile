import { useState } from "react";
import { Menu } from "react-native-paper";
import PropTypes from "prop-types";

import { useTranslation } from "localization";
import { Button } from "./Button";
import { IconButton } from "./IconButton";

export const MenuButton = (props) => {
  const { icon, items, label, style } = props;

  const { t } = useTranslation();
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
            leadingIcon={icon}
            onPress={() => {
              if (!keepMenuOpenOnPress) {
                closeMenu();
              }
              onPress();
            }}
            title={t(label)}
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
