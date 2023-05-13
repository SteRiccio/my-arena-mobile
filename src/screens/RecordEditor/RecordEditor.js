import React, { useCallback } from "react";
import { View } from "react-native";
import MenuDrawer from "react-native-side-drawer";
import { useDispatch } from "react-redux";

import { CloseIconButton, HView, Text, VView } from "components";
import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";
import { Breadcrumbs } from "./Breadcrumbs";
import { NodePageNavigationBar } from "./NodePageNavigationBar";
import { PagesNavigationTree } from "./PagesNavigationTree";
import { RecordPageForm } from "./RecordPageForm";

import styles from "./styles.js";

export const RecordEditor = () => {
  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();
  const pageSelectorOpen = DataEntrySelectors.useIsRecordPageSelectorMenuOpen();

  const drawerContent = useCallback(() => {
    if (!pageSelectorOpen) return null;
    return (
      <View style={styles.pagesNavigatorContainer}>
        <HView>
          <Text
            variant="headlineMedium"
            style={styles.titleText}
            textKey={survey.props.name}
          />
          <CloseIconButton
            onPress={() => dispatch(DataEntryActions.toggleRecordPageMenuOpen)}
            style={styles.closeButton}
          />
        </HView>
        <PagesNavigationTree />
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
      overlay
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
