import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    margin: 10,
    gap: 20,
    flex: 1,
  },
  selectedItemsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  list: {
    flex: 1,
  },
  item: {
    paddingVertical: 0,
  },
  clearButton: {
    alignSelf: "flex-end",
  },
});
