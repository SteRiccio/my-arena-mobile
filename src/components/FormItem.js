import PropTypes from "prop-types";

import { useTranslation } from "localization";

import { HView } from "./HView";
import { Text } from "./Text";

export const FormItem = ({
  children,
  labelKey,
  labelVariant = "labelLarge",
  style,
  textVariant = "bodyLarge",
}) => {
  const { t } = useTranslation();
  const label = `${t(labelKey)}:`;
  const hasTextContent =
    typeof children === "string" || typeof children === "number";

  return (
    <HView style={[{ alignItems: "baseline" }, style]}>
      <Text variant={labelVariant}>{label}</Text>
      {hasTextContent ? (
        <Text variant={textVariant}>{children}</Text>
      ) : (
        children
      )}
    </HView>
  );
};

FormItem.propTypes = {
  children: PropTypes.node,
  labelKey: PropTypes.string.isRequired,
  labelVariant: PropTypes.string,
  style: PropTypes.object,
  textVariant: PropTypes.string,
};
