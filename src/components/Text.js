import { Text as RNText } from "react-native-paper";

import { useTranslation } from "localization";

export const Text = (props) => {
  const { numberOfLines, style, textKey, textParams, variant, children } =
    props;

  const { t } = useTranslation();

  return (
    <RNText numberOfLines={numberOfLines} style={style} variant={variant}>
      {t(textKey, textParams)}
      {children}
    </RNText>
  );
};
