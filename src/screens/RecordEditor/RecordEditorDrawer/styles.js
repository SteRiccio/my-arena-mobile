import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

import { Environment } from "utils/Environment";

export const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: Environment.isIOS ? 0.8 : 0.85,
      backgroundColor: theme.colors.surfaceVariant,
      padding: 10,
      borderWidth: 1,
      gap: 10,
    },
    titleContainer: {
      backgroundColor: "transparent",
      alignItems: "flex-start",
      borderBottomWidth: 2,
    },
    titleText: {
      flex: 1,
      margin: 6,
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
