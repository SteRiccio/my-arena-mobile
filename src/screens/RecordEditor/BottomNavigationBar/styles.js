import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      justifyContent: "space-between",
      borderTopWidth: 2,
      borderTopColor: theme.colors.primary,
      backgroundColor: theme.colors.secondaryContainer,
      padding: 4
    },
  });
};
