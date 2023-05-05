import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import MenuDrawer from "react-native-side-drawer";
import { useDispatch } from "react-redux";

import { CloseIconButton, VView } from "components";
import { DataEntryActions, DataEntrySelectors } from "state";
import { Breadcrumbs } from "./Breadcrumbs";
import { NodePageNavigationBar } from "./NodePageNavigationBar";
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
      open={pageSelectorOpen}
      position="left"
      drawerContent={drawerContent()}
      drawerPercentage={45}
      animationTime={250}
      overlay={true}
      opacity={0.4}
    >
      <VView style={{ flex: 1 }}>
        <Breadcrumbs />
        <RecordPageForm />
        <NodePageNavigationBar />
      </VView>
    </MenuDrawer>
  );
};
