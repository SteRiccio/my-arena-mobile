import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingTop: 6,
      paddingBottom: 10,
      justifyContent: "space-between",
      borderTopWidth: 2,
      borderTopColor: theme.colors.primary,
      backgroundColor: theme.colors.secondaryContainer,
    },
  });
};
