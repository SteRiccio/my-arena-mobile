import { Text as RNText } from "react-native-paper";

import { useTranslation } from "localization";

export const Text = (props) => {
  const { style, textKey, textParams, variant, children } = props;

  const { t } = useTranslation();

  return (
    <RNText style={style} variant={variant}>
      {t(textKey, textParams)}
      {children}
    </RNText>
  );
};
