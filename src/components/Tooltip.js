import { Tooltip as RNPTooltip } from "react-native-paper";
import PropTypes from "prop-types";

import { useTranslation } from "localization";

export const Tooltip = (props) => {
  const { backgroundColor, children, textColor, titleKey } = props;

  const { t } = useTranslation();

  const theme =
    backgroundColor || textColor
      ? {
          isV3: true,
          colors: {
            onSurface: backgroundColor,
            surface: textColor,
          },
        }
      : undefined;

  return (
    <RNPTooltip enterTouchDelay={50} theme={theme} title={t(titleKey)}>
      {children}
    </RNPTooltip>
  );
};

Tooltip.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
  textColor: PropTypes.string,
  titleKey: PropTypes.string,
};
