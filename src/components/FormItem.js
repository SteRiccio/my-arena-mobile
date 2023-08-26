import { useTranslation } from "localization";

import { HView } from "./HView";
import { Text } from "./Text";

export const FormItem = ({ labelKey, children }) => {
  const { t } = useTranslation();
  const label = `${t(labelKey)}:`;
  return (
    <HView style={{ alignItems: "baseline" }}>
      <Text variant="labelLarge">{label}</Text>
      <Text variant="bodyLarge">{children}</Text>
    </HView>
  );
};
