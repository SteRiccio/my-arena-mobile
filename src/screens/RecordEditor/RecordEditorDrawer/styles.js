import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    titleContainer: {
      backgroundColor: "transparent",
      alignItems: "flex-start",
      borderBottomWidth: 2,
    },
    titleText: {
      flex: 1,
      margin: 6,
    },
    pagesNavigatorContainer: {
      flex: 0.8,
      backgroundColor: theme.colors.surfaceVariant,
      padding: 10,
      borderWidth: 1,
      gap: 10
    },
    closeButton: {},
    buttonBar: {
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
};
