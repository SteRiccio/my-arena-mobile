import { ScrollView as RNScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import PropTypes from "prop-types";

export const ScrollView = (props) => {
  const {
    children,
    persistentScrollbar,
    style: styleProp,
    transparent,
    ...otherProps
  } = props;

  const theme = useTheme();

  const style = [
    { backgroundColor: transparent ? "transparent" : theme.colors.background },
    styleProp,
  ];

  return (
    <RNScrollView
      persistentScrollbar={persistentScrollbar}
      style={style}
      {...otherProps}
    >
      {children}
    </RNScrollView>
  );
};

ScrollView.propTypes = {
  children: PropTypes.node,
  persistentScrollbar: PropTypes.bool,
  style: PropTypes.object,
  transparent: PropTypes.bool,
};
