import React, { useCallback } from "react";
import { View } from "react-native";
import MenuDrawer from "react-native-side-drawer";
import { useDispatch } from "react-redux";

import { CloseIconButton, VView } from "components";
import { DataEntryActions, DataEntrySelectors } from "state";
import { Breadcrumbs } from "./Breadcrumbs";
import { NodePageNavigationBar } from "./NodePageNavigationBar";
import { PagesTree } from "./PagesTree";
import { RecordPageForm } from "./RecordPageForm";

import styles from "./styles.js";

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
      drawerPercentage={75}
      animationTime={250}
      overlay={true}
      opacity={0.4}
    >
      <VView style={styles.internalContainer}>
        <Breadcrumbs />
        <RecordPageForm />
        <NodePageNavigationBar />
      </VView>
    </MenuDrawer>
  );
};
