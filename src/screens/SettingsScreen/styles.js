import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  settingsWrapper: {},
  settingsItemWrapper: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingsFormItemVertical: {
    flexDirection: "column",
  },
  settingsFormItemHorizontal: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
