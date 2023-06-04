import React from "react";
import { Button as RNButton } from "react-native-paper";

import { useTranslation } from "localization";

export const Button = (props) => {
  const { children, loading, textKey, ...otherProps } = props;

  const { t } = useTranslation();
  const text = t(textKey);

  return (
    <RNButton loading={loading} {...otherProps}>
      {text}
      {children}
    </RNButton>
  );
};

Button.defaultProps = {
  mode: "contained",
};
