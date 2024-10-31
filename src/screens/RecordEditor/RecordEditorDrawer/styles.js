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
      flex: 0.85,
      backgroundColor: theme.colors.surfaceVariant,
      padding: 10,
      borderWidth: 1,
      gap: 10,
    },
    closeButton: {},
    buttonBar: {
      alignItems: "center",
      borderTopWidth: 1,
      justifyContent: "space-between",
      paddingTop: 4,
      width: "100%",
    },
  });
};
