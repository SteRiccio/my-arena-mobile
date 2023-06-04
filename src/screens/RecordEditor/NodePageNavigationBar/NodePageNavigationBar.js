import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { NodeDefs, Objects } from "@openforis/arena-core";

import { useKeyboardIsVisible } from "hooks";
import { Button, HView, View } from "components";
import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";
import { NodePageNavigationButton } from "./NodePageNavigationButton";
import { RecordPageNavigator } from "./RecordPageNavigator";

import styles from "./styles";

export const NodePageNavigationBar = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const keyboardVisible = useKeyboardIsVisible();
  const survey = SurveySelectors.useCurrentSurvey();
  const record = DataEntrySelectors.useRecord();

  const currentEntityPointer = DataEntrySelectors.useCurrentPageEntity();
  const { entityDef } = currentEntityPointer;

  if (__DEV__) {
    console.log(
      `rendering NodePageNavigationBar for ${NodeDefs.getName(entityDef)}`
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

  if (keyboardVisible) {
    return null;
  }

  return (
    <HView style={styles.container}>
      <View>
        {NodeDefs.isRoot(entityDef) && (
          <Button
            icon="format-list-bulleted"
            textKey="dataEntry:listOfRecords"
            onPress={() => {
              dispatch(DataEntryActions.navigateToRecordsList({ navigation }));
            }}
          />
        )}
        {prevEntityPointer && (
          <NodePageNavigationButton
            icon="chevron-left"
            entityPointer={prevEntityPointer}
          />
        )}
      </View>
      <View>
        {nextEntityPointer &&
          !Objects.isEqual(nextEntityPointer, prevEntityPointer) && (
            <NodePageNavigationButton
              icon="chevron-right"
              entityPointer={nextEntityPointer}
            />
          )}
      </View>
    </HView>
  );
};
