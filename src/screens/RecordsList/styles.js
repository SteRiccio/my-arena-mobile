import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  formItem: { alignItems: "center" },
  formItemLabel: { fontSize: 16, width: 170 },
  innerContainer: {
    flex: 1,
    padding: 4,
  },
  bottomActionBar: {
    borderTopWidth: 1,
    padding: 4,
    justifyContent: "space-between",
  },
  newRecordButton: {
    alignSelf: "center",
  },
  checkSyncStatusButton: {
    alignSelf: "flex-end",
  },
  exportButton: {
    alignSelf: "flex-end",
  },
});
