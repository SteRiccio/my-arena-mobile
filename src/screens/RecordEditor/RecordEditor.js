import React from "react";
import MenuDrawer from "react-native-side-drawer";

import { RecordEditViewMode } from "model";
import { VView } from "components";
import { DataEntrySelectors } from "state";

import { NodePageNavigationBar } from "./NodePageNavigationBar";
import { RecordPageForm } from "./RecordPageForm";
import { RecordEditorDrawer } from "./RecordEditorDrawer";
import { RecordNodesCarousel } from "./RecordNodesCarousel";
import { SingleNodesNavigationBar } from "./SingleNodesNavigationBar";

import styles from "./styles.js";

export const RecordEditor = () => {
  const pageSelectorOpen = DataEntrySelectors.useIsRecordPageSelectorMenuOpen();
  const viewMode = DataEntrySelectors.useRecordEditViewMode();

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
        {viewMode === RecordEditViewMode.form ? (
          <RecordPageForm />
        ) : (
          <RecordNodesCarousel />
        )}
        {viewMode === RecordEditViewMode.form ? (
          <NodePageNavigationBar />
        ) : (
          <SingleNodesNavigationBar />
        )}
      </VView>
    </MenuDrawer>
  );
};
