import React from "react";
import MenuDrawer from "react-native-side-drawer";

import { RecordEditViewMode } from "model";
import { HView, VView, View } from "components";
import { DataEntrySelectors, SurveyOptionsSelectors } from "state";
import { DeviceInfoSelectors } from "state/deviceInfo";

import { BottomNavigationBar } from "./BottomNavigationBar";
import { RecordPageForm } from "./RecordPageForm";
import { RecordEditorDrawer } from "./RecordEditorDrawer";
import { RecordNodesCarousel } from "./RecordNodesCarousel";
import { StatusBar } from "./StatusBar";

import styles from "./styles.js";

export const RecordEditor = () => {
  const pageSelectorOpen = DataEntrySelectors.useIsRecordPageSelectorMenuOpen();
  const viewMode = SurveyOptionsSelectors.useRecordEditViewMode();

  const isPhone = DeviceInfoSelectors.useIsPhone();

  const internalContainer = (
    <VView style={styles.internalContainer}>
      <StatusBar />

      {viewMode === RecordEditViewMode.form ? (
        <RecordPageForm />
      ) : (
        <RecordNodesCarousel />
      )}
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
