import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import MenuDrawer from "react-native-side-drawer";

import { HView, VView, View } from "components";
import { RecordEditViewMode } from "model";
import { useBackHandler } from "hooks";
import {
  DataEntryActions,
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
  if (__DEV__) {
    console.log(`rendering RecordEditor`);
  }
  const dispatch = useDispatch();
  const pageSelectorOpen = DataEntrySelectors.useIsRecordPageSelectorMenuOpen();
  const viewMode = SurveyOptionsSelectors.useRecordEditViewMode();
  const { showStatusBar } = SettingsSelectors.useSettings();
  const navigation = useNavigation();

  const onBack = useCallback(() => {
    dispatch(DataEntryActions.navigateToRecordsList({ navigation }));
    return true; // the event will not be bubbled up & no other back action will execute
  }, [navigation]);

  useBackHandler(onBack);

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
