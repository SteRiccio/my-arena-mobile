import { useState } from "react";
import { Menu } from "react-native-paper";
import PropTypes from "prop-types";

import { useTranslation } from "localization";
import { IconButton } from "./IconButton";
import { Button } from "./Button";

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
        icon ? (
          <IconButton icon={icon} onPress={openMenu} />
        ) : (
          <Button textKey={label} onPress={onPress} />
        )
      }
    >
      {items.map(({ key, disabled, icon, label, onPress }) => (
        <Menu.Item
          key={key}
          disabled={disabled}
          leadingIcon={icon}
          onPress={onPress}
          title={t(label)}
        />
      ))}
    </Menu>
  );
};

MenuButton.propTypes = {
  icon: PropTypes.string,
  items: PropTypes.array.isRequired,
  label: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
