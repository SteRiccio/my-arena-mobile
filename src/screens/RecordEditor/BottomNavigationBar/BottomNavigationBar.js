import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import { NodeDefs } from "@openforis/arena-core";

import { NavigateToRecordsListButton } from "appComponents/NavigateToRecordsListButton";
import { HView, IconButton, View } from "components";
import { DataEntryActions, DataEntrySelectors } from "state";

import { NodePageNavigationButton } from "./NodePageNavigationButton";
import { SingleNodeNavigationButton } from "./SingleNodeNavigationButton";
import { useBottomNavigationBar } from "./useBottomNavigationBar";

import { useStyles } from "./styles";

export const BottomNavigationBar = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const currentEntityPointer = DataEntrySelectors.useCurrentPageEntity();
  const { entityDef } = currentEntityPointer;

  if (__DEV__) {
    console.log(
      `rendering BottomNavigationBar for ${NodeDefs.getName(entityDef)}`
    );
  }
  const {
    activeChildIndex,
    listOfRecordsButtonVisible,
    newButtonVisible,
    nextEntityPointer,
    nextPageButtonVisible,
    nextSingleNodeButtonVisible,
    prevEntityPointer,
    prevPageButtonVisible,
    prevSingleNodeButtonVisible,
  } = useBottomNavigationBar();

  const onNewPress = useCallback(() => {
    dispatch(DataEntryActions.addNewEntity);
  }, [dispatch]);

  return (
    <HView style={styles.container}>
      <View style={styles.buttonContainer} transparent>
        {listOfRecordsButtonVisible && <NavigateToRecordsListButton />}
        {prevPageButtonVisible && (
          <NodePageNavigationButton
            icon="chevron-left"
            entityPointer={prevEntityPointer}
            style={styles.leftButton}
          />
        )}
        {prevSingleNodeButtonVisible && (
          <SingleNodeNavigationButton
            icon="chevron-left"
            childDefIndex={activeChildIndex - 1}
            style={styles.leftButton}
          />
        )}
      </View>

      {newButtonVisible && (
        <IconButton
          avoidMultiplePress
          icon="plus"
          mode="contained"
          onPress={onNewPress}
          selected
        />
      )}

      <View style={styles.buttonContainer} transparent>
        {nextPageButtonVisible && (
          <NodePageNavigationButton
            icon="chevron-right"
            entityPointer={nextEntityPointer}
            style={styles.rightButton}
          />
        )}
        {nextSingleNodeButtonVisible && (
          <SingleNodeNavigationButton
            icon="chevron-right"
            childDefIndex={activeChildIndex + 1}
            style={styles.rightButton}
          />
        )}
      </View>
    </HView>
  );
};
