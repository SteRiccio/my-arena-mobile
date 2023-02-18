import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import MenuDrawer from "react-native-side-drawer";
import { useDispatch } from "react-redux";

import { CloseIconButton } from "../../components";
import { DataEntryActions } from "../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../state/dataEntry/selectors";
import { PagesTree } from "./PagesTree";
import { RecordPageForm } from "./RecordPageForm";

const styles = StyleSheet.create({
  animatedBox: {
    flex: 1,
    backgroundColor: "#38C8EC",
    padding: 10,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F04812",
  },
});

export const RecordEditor = () => {
  const dispatch = useDispatch();
  const pageSelectorOpen = DataEntrySelectors.useIsRecordPageSelectorMenuOpen();

  const drawerContent = useCallback(() => {
    if (!pageSelectorOpen) return null;
    return (
      <View style={styles.animatedBox}>
        <CloseIconButton
          onPress={() => dispatch(DataEntryActions.toggleRecordPageMenuOpen)}
        />
        <PagesTree />
      </View>
    );
  }, [pageSelectorOpen]);

  return (
    <MenuDrawer
      open={open}
      position="left"
      drawerContent={drawerContent()}
      drawerPercentage={45}
      animationTime={250}
      overlay={true}
      opacity={0.4}
    >
      <RecordPageForm />
    </MenuDrawer>
  );
};
