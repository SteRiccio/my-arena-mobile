import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      borderWidth: 1,
      borderRadius: 5,
      borderColor: theme.colors.onBackground,
    },
    headerButton: {
      width: "100%",
    },
    headerButtonLabel: {
      fontSize: 16,
    },
    headerButtonContent: {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
    },
    collapsibleContainer: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
  });
};
