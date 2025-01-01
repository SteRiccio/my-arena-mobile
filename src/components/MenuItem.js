import { Menu } from "react-native-paper";
import PropTypes from "prop-types";

import { useIsTextDirectionRtl, useTranslation } from "localization";

const styleRtl = { alignSelf: "flex-end" };

export const MenuItem = (props) => {
  const { icon, onPress, title, toggleMenu = undefined } = props;

  const { t } = useTranslation();
  const isRtl = useIsTextDirectionRtl();

  return (
    <Menu.Item
      leadingIcon={isRtl ? undefined : icon}
      onPress={() => {
        toggleMenu?.();
        onPress();
      }}
      style={isRtl ? styleRtl : undefined}
      title={t(title)}
      trailingIcon={isRtl ? icon : undefined}
    />
  );
};

MenuItem.propTypes = {
  icon: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  toggleMenu: PropTypes.func,
};
