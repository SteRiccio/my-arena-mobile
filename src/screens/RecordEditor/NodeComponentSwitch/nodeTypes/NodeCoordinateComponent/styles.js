import { StyleSheet } from "react-native";

export default StyleSheet.create({
  formItem: { alignItems: "center" },
  formItemLabel: {
    width: 100,
    fontSize: 14,
    marginRight: 10,
  },
  accuracyFormItem: {
    alignItems: "baseline",
  },
  numericTextInput: {
    width: 150,
    alignSelf: "stretch",
  },
  accuracyField: {
    fontSize: 18,
  },
  textInputNotApplicable: {
    backgroundColor: "lightgray",
  },
});
