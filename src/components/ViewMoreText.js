import RNViewMoreText from "react-native-view-more-text";
import PropTypes from "prop-types";

export const ViewMoreText = (props) => {
  const { children, numberOfLines = 2, textStyle } = props;
  return (
    <RNViewMoreText numberOfLines={numberOfLines} textStyle={textStyle}>
      {children}
    </RNViewMoreText>
  );
};

ViewMoreText.propTypes = {
  children: PropTypes.node,
  numberOfLines: PropTypes.number,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
