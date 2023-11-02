import { Text as RNText } from "react-native-paper";
import PropTypes from "prop-types";

import { useTranslation } from "localization";

export const Text = (props) => {
  const {
    children,
    numberOfLines,
    selectable,
    style,
    textKey,
    textParams,
    variant,
  } = props;

  const { t } = useTranslation();

  return (
    <RNText
      numberOfLines={numberOfLines}
      selectable={selectable}
      style={style}
      variant={variant}
    >
      {t(textKey, textParams)}
      {children}
    </RNText>
  );
};

Text.propTypes = {
  children: PropTypes.node,
  numberOfLines: PropTypes.number,
  selectable: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textKey: PropTypes.string,
  textParams: PropTypes.object,
  variant: PropTypes.oneOf([
    "displayLarge",
    "displayMedium",
    "displaySmall",
    "headlineLarge",
    "headlineMedium",
    "headlineSmall",
    "titleLarge",
    "titleMedium",
    "titleSmall",
    "labelLarge",
    "labelMedium",
    "labelSmall",
    "bodyLarge",
    "bodyMedium",
    "bodySmall",
  ]),
};
