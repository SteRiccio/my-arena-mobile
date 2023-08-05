import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { NodeDefs, Objects } from "@openforis/arena-core";

import { Button, HView, View } from "components";
import { RecordEditViewMode } from "model";
import { useKeyboardIsVisible } from "hooks";
import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";

import { NodePageNavigationButton } from "./NodePageNavigationButton";
import { RecordPageNavigator } from "../../../model/RecordPageNavigator";
import { SingleNodeNavigationButton } from "./SingleNodeNavigationButton";

import styles from "./styles";

export const BottomNavigationBar = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const keyboardVisible = useKeyboardIsVisible();
  const survey = SurveySelectors.useCurrentSurvey();
  const record = DataEntrySelectors.useRecord();

  const currentEntityPointer = DataEntrySelectors.useCurrentPageEntity();
  const { entityDef } = currentEntityPointer;

  const viewMode = DataEntrySelectors.useRecordEditViewMode();

  if (__DEV__) {
    console.log(
      `rendering BottomNavigationBar for ${NodeDefs.getName(entityDef)}`
    );
  }

  const prevEntityPointer = useMemo(
    () =>
      RecordPageNavigator.getPrevEntityPointer({
        survey,
        record,
        currentEntityPointer,
      }),
    [survey, record, currentEntityPointer]
  );

  const nextEntityPointer = useMemo(
    () =>
      RecordPageNavigator.getNextEntityPointer({
        survey,
        record,
        currentEntityPointer,
      }),
    [survey, record, currentEntityPointer]
  );

  const childDefs = DataEntrySelectors.useCurrentPageEntityRelevantChildDefs();
  const activeChildIndex =
    DataEntrySelectors.useCurrentPageEntityActiveChildIndex();

  if (viewMode !== RecordEditViewMode.oneNode && keyboardVisible) {
    return null;
  }

  const listOfRecordsButtonVisible =
    NodeDefs.isRoot(entityDef) &&
    (viewMode !== RecordEditViewMode.oneNode || activeChildIndex === 0);

  const pageButtonsVisible = viewMode !== RecordEditViewMode.oneNode;
  const prevPageButtonVisible = pageButtonsVisible && prevEntityPointer;

  const nextPageButtonVisible =
    pageButtonsVisible &&
    nextEntityPointer &&
    !Objects.isEqual(nextEntityPointer, prevEntityPointer);

  const singleNodesButtonsVisible = viewMode === RecordEditViewMode.oneNode;
  const prevSingleNodeButtonVisible =
    singleNodesButtonsVisible && activeChildIndex > 0;
  const nextSingleNodeButtonVisible =
    singleNodesButtonsVisible && activeChildIndex < childDefs.length;

  return (
    <HView style={styles.container}>
      <View>
        {listOfRecordsButtonVisible && (
          <Button
            icon="format-list-bulleted"
            textKey="dataEntry:listOfRecords"
            onPress={() => {
              dispatch(DataEntryActions.navigateToRecordsList({ navigation }));
            }}
          />
        )}
        {prevPageButtonVisible && (
          <NodePageNavigationButton
            icon="chevron-left"
            entityPointer={prevEntityPointer}
          />
        )}
        {prevSingleNodeButtonVisible && (
          <SingleNodeNavigationButton
            icon="chevron-left"
            childDefIndex={activeChildIndex - 1}
          />
        )}
      </View>
      <View>
        {nextPageButtonVisible && (
          <NodePageNavigationButton
            icon="chevron-right"
            entityPointer={nextEntityPointer}
          />
        )}
        {nextSingleNodeButtonVisible && (
          <SingleNodeNavigationButton
            icon="chevron-right"
            childDefIndex={activeChildIndex + 1}
          />
        )}
      </View>
    </HView>
  );
};
