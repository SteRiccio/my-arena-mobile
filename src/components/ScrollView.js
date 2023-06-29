import { ScrollView as RNScrollView } from "react-native";
import { useTheme } from "react-native-paper";

export const ScrollView = (props) => {
  const {
    persistentScrollbar,
    children,
    style: styleProp,
    ...otherProps
  } = props;

  const theme = useTheme();

  const style = [{ backgroundColor: theme.colors.background }, styleProp];

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
