import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    formItem: {
      width: "100%",
      paddingTop: 8,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.primary,
    },
    formItemOneNode: {
      flex: 1,
      borderBottomWidth: 0,
    },
    nodeDefLabelContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    nodeDefLabel: {
      flexGrow: 1,
    },
    nodeDefDescriptionViewMoreText: {
      textAlign: "justify",
    },
    nodeDefDescriptionText: {
      fontStyle: "italic",
    },
    internalContainer: {
      width: "100%",
    },
  });
};
