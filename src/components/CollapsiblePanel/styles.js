import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: { borderWidth: 1, borderRadius: 10 },
  headerButton: {
    width: "100%",
  },
  headerButtonLabel: {
    fontSize: 16,
  },
  headerButtonContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  collapsibleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});
