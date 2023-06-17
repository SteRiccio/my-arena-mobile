import React from "react";
import { Tooltip as RNPTooltip } from "react-native-paper";

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
