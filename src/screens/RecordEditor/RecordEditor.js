import React from "react";
import MenuDrawer from "react-native-side-drawer";

import { RecordEditViewMode } from "model";
import { VView } from "components";
import { DataEntrySelectors, SurveyOptionsSelectors } from "state";
import { DeviceInfoSelectors } from "state/deviceInfo";

import { BottomNavigationBar } from "./BottomNavigationBar";
import { RecordPageForm } from "./RecordPageForm";
import { RecordEditorDrawer } from "./RecordEditorDrawer";
import { RecordNodesCarousel } from "./RecordNodesCarousel";

import styles from "./styles.js";

export const RecordEditor = () => {
  const pageSelectorOpen = DataEntrySelectors.useIsRecordPageSelectorMenuOpen();
  const viewMode = SurveyOptionsSelectors.useRecordEditViewMode();

  const isPhone = DeviceInfoSelectors.useIsPhone();

  return (
    <MenuDrawer
      open={pageSelectorOpen}
      position="left"
      drawerContent={<RecordEditorDrawer />}
      drawerPercentage={isPhone ? 75 : 50}
      animationTime={250}
      overlay={isPhone}
      opacity={isPhone ? 0.4 : 1}
    >
      <VView style={styles.internalContainer}>
        {viewMode === RecordEditViewMode.form ? (
          <RecordPageForm />
        ) : (
          <RecordNodesCarousel />
        )}
        <BottomNavigationBar />
      </VView>
    </MenuDrawer>
  );
};
