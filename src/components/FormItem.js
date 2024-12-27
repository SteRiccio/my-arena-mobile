import PropTypes from "prop-types";

import { useTranslation } from "localization";

import { Text } from "./Text";
import { HViewTextDirectionAware } from "./HViewTextDirectionAware";

export const FormItem = ({
  children,
  labelKey,
  labelNumberOfLines = undefined,
  labelStyle = undefined,
  labelVariant = "labelLarge",
  style,
  textVariant = "bodyLarge",
}) => {
  const { t } = useTranslation();
  const label = `${t(labelKey)}:`;
  const hasTextContent =
    typeof children === "string" || typeof children === "number";

  return (
    <HViewTextDirectionAware style={[{ alignItems: "baseline" }, style]}>
      <Text
        numberOfLines={labelNumberOfLines}
        style={labelStyle}
        variant={labelVariant}
      >
        {label}
      </Text>
      {hasTextContent ? (
        <Text variant={textVariant}>{children}</Text>
      ) : (
        children
      )}
    </HViewTextDirectionAware>
  );
};

FormItem.propTypes = {
  children: PropTypes.node,
  labelKey: PropTypes.string.isRequired,
  labelNumberOfLines: PropTypes.number,
  labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  labelVariant: PropTypes.string,
  style: PropTypes.object,
  textVariant: PropTypes.string,
};
