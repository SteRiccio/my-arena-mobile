import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
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
});
