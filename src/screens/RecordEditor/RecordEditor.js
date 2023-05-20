import React from "react";
import MenuDrawer from "react-native-side-drawer";

import { VView } from "components";
import { DataEntrySelectors } from "state";
import { NodePageNavigationBar } from "./NodePageNavigationBar";
import { RecordPageForm } from "./RecordPageForm";
import { RecordEditorDrawer } from "./RecordEditorDrawer";

import styles from "./styles.js";

export const RecordEditor = () => {
  const pageSelectorOpen = DataEntrySelectors.useIsRecordPageSelectorMenuOpen();

  return (
    <MenuDrawer
      open={pageSelectorOpen}
      position="left"
      drawerContent={<RecordEditorDrawer />}
      drawerPercentage={75}
      animationTime={250}
      overlay
      opacity={0.4}
    >
      <VView style={styles.internalContainer}>
        <RecordPageForm />
        <NodePageNavigationBar />
      </VView>
    </MenuDrawer>
  );
};
