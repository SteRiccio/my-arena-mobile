import { useTranslation } from "localization";

import { HView } from "./HView";
import { Text } from "./Text";

export const FormItem = ({ labelKey, children, labelVariant, textVariant }) => {
  const { t } = useTranslation();
  const label = `${t(labelKey)}:`;
  return (
    <HView style={{ alignItems: "baseline" }}>
      <Text variant={labelVariant}>{label}</Text>
      <Text variant={textVariant}>{children}</Text>
    </HView>
  );
};

FormItem.defaultProps = {
  labelVariant: "labelLarge",
  textVariant: "bodyLarge",
};
