import PropTypes from "prop-types";

import { Text } from "components";

export const Indicator = (props) => {
  const { isExpanded, hasChildrenNodes } = props;

  const getIndicatorText = () => {
    if (!hasChildrenNodes) {
      return " ";
    }
    if (isExpanded) {
      return "-";
    }
    return "+";
  };

  return (
    <Text
      style={{ fontSize: 32, width: 22, lineHeight: 34 }}
      textKey={getIndicatorText()}
    />
  );
};

Indicator.propTypes = {
  isExpanded: PropTypes.bool,
  hasChildrenNodes: PropTypes.bool,
};
