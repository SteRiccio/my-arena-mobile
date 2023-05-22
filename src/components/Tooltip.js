import React from "react";
import { Tooltip as RNPTooltip } from "react-native-paper";

import { useTranslation } from "localization";

export const Tooltip = (props) => {
  const { children, titleKey } = props;

  const { t } = useTranslation();

  return (
    <RNPTooltip enterTouchDelay={50} title={t(titleKey)}>
      {children}
    </RNPTooltip>
  );
};
