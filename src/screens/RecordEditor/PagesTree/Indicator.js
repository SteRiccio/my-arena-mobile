import { Text } from "../../../components";

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

  return <Text style={{ width: 20 }} textKey={getIndicatorText()} />;
};
