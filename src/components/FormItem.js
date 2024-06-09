import PropTypes from "prop-types";

import { useTranslation } from "localization";

import { HView } from "./HView";
import { Text } from "./Text";

export const FormItem = ({
  children,
  labelKey,
  labelVariant,
  style,
  textVariant,
}) => {
  const { t } = useTranslation();
  const label = `${t(labelKey)}:`;
  const hasTextContent = typeof children === "string";

  return (
    <HView style={[{ alignItems: "baseline" }, style]}>
      <Text variant={labelVariant}>{label}</Text>
      <Text variant={textVariant}>{children}</Text>
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

FormItem.defaultProps = {
  labelVariant: "labelLarge",
  textVariant: "bodyLarge",
};
