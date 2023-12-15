import { useTheme } from "react-native-paper";
import RNPIcon from "react-native-paper/src/components/Icon";

export const Icon = (props) => {
  const theme = useTheme();
  return <RNPIcon color={theme.colors.onBackground} {...props} />;
};
