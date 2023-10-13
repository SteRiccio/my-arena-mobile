import { StyleSheet } from "react-native";
import { BaseStyles } from "utils/BaseStyles";

const internalContainerWrapperInTablet = {
  ...BaseStyles.fullWidthAndHeight,
};
export default StyleSheet.create({
  externalContainerInTablet: {
    flex: 1,
  },
  drawerWrapperInTablet: {
    ...BaseStyles.fullHeight,
    width: "40%",
  },
  internalContainerWrapperInTablet,

  internalContainerWrapperInTabletPageSelectorOpen: {
    ...internalContainerWrapperInTablet,
    width: "60%",
  },
  internalContainer: {
    flex: 1,
  },
});
