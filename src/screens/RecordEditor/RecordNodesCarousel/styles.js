import { StyleSheet } from "react-native";

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    pager: {
      flex: 1,
    },
    childContainer: {
      margin: 10,
      flex: 1,
    },
  });
};
