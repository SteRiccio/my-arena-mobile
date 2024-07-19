import { useTheme } from "react-native-paper";
import RNPIcon from "react-native-paper/src/components/Icon";
import PropTypes from "prop-types";

export const Icon = (props) => {
  const { size = 20, ...otherProps } = props;
  const theme = useTheme();
  return (
    <RNPIcon color={theme.colors.onBackground} size={size} {...otherProps} />
  );
};

Icon.propTypes = {
  size: PropTypes.number,
  source: PropTypes.string.isRequired,
};
