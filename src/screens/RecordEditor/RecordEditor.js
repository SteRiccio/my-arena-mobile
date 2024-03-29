import React from "react";
import MenuDrawer from "react-native-side-drawer";

import { RecordEditViewMode } from "model";
import { HView, VView, View } from "components";
import {
  DataEntrySelectors,
  DeviceInfoSelectors,
  SettingsSelectors,
  SurveyOptionsSelectors,
} from "state";

import { BottomNavigationBar } from "./BottomNavigationBar";
import { RecordPageForm } from "./RecordPageForm";
import { RecordEditorDrawer } from "./RecordEditorDrawer";
import { RecordNodesCarousel } from "./RecordNodesCarousel";
import { StatusBar } from "./StatusBar";

import styles from "./styles.js";

export const RecordEditor = () => {
  const pageSelectorOpen = DataEntrySelectors.useIsRecordPageSelectorMenuOpen();
  const viewMode = SurveyOptionsSelectors.useRecordEditViewMode();
  const { showStatusBar } = SettingsSelectors.useSettings();

  const isPhone = DeviceInfoSelectors.useIsPhone();

  const internalContainer = (
    <VView style={styles.internalContainer}>
      {viewMode === RecordEditViewMode.form ? (
        <RecordPageForm />
      ) : (
        <RecordNodesCarousel />
      )}
      {showStatusBar && <StatusBar />}
      <BottomNavigationBar />
    </VView>
  );

  if (isPhone) {
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
        {internalContainer}
      </MenuDrawer>
    );
  }
  return (
    <HView style={styles.externalContainerInTablet}>
      {pageSelectorOpen && (
        <View style={styles.drawerWrapperInTablet}>
          <RecordEditorDrawer />
        </View>
      )}
      <View
        style={
          pageSelectorOpen
            ? styles.internalContainerWrapperInTabletPageSelectorOpen
            : styles.internalContainerWrapperInTablet
        }
      >
        {internalContainer}
      </View>
    </HView>
  );
};
