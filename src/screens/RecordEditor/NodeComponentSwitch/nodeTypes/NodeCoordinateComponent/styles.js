import { StyleSheet } from "react-native";

export default StyleSheet.create({
  formItem: { alignItems: "center" },
  formItemLabel: {
    width: 50,
    fontSize: 14,
    marginRight: 10,
  },
  extraFieldFormItemLabel: {
    width: 180,
  },
  accuracyFormItem: {
    alignItems: "baseline",
  },
  numericTextInput: {
    width: 180,
    alignSelf: "stretch",
  },
  accuracyField: {
    fontSize: 18,
  },
  textInputNotApplicable: {
    backgroundColor: "lightgray",
  },
});
