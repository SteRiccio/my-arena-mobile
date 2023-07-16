import React, { useCallback } from "react";
import { Button as RNButton } from "react-native-paper";

import { useTranslation } from "localization";

export const Button = (props) => {
  const {
    children,
    loading,
    onPress: onPressProp,
    textKey,
    ...otherProps
  } = props;

  const { t } = useTranslation();
  const text = t(textKey);

  const onPress = useCallback(
    (event) => {
      if (!loading) {
        onPressProp(event);
      }
    },
    [loading]
  );

  return (
    <RNButton loading={loading} onPress={onPress} {...otherProps}>
      {text}
      {children}
    </RNButton>
  );
};

Button.defaultProps = {
  mode: "contained",
};
