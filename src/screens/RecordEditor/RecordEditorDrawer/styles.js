import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    titleText: {
      flex: 1,
    },
    titleContainer: {
      backgroundColor: "transparent",
      alignItems: "center",
    },
    pagesNavigatorContainer: {
      flex: 0.8,
      backgroundColor: theme.colors.surfaceVariant,
      padding: 10,
      borderWidth: 1,
    },
    closeButton: {
      alignSelf: "flex-end",
    },
    buttonBar: {
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
};
