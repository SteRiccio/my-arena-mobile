import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    display: "flex",
    width: "100%",
  },
  scrollViewRtl: {
    transform: [{ scaleX: -1 }],
  },
  scrollViewContent: {
    flexDirection: "row",
  },
  item: { alignItems: "center", width: "auto" },
  itemRtl: { transform: [{ scaleX: -1 }] },
  itemButton: {},
  itemButtonLabel: { fontSize: 20 },
});
