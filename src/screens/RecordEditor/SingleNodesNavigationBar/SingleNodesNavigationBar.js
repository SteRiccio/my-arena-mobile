import React from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { NodeDefs } from "@openforis/arena-core";

import { Button, HView, View } from "components";
import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";
import { SingleNodeNavigationButton } from "./SingleNodeNavigationButton";

import styles from "./styles";

export const SingleNodesNavigationBar = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const currentEntityPointer = DataEntrySelectors.useCurrentPageEntity();
  const { entityDef } = currentEntityPointer;

  if (__DEV__) {
    console.log(
      `rendering SingleNodesNavigationBar for ${NodeDefs.getName(entityDef)}`
    );
  }

  const childDefs = DataEntrySelectors.useCurrentPageEntityRelevantChildDefs();
  const activeChildIndex =
    DataEntrySelectors.useCurrentPageEntityActiveChildIndex();

  return (
    <HView style={styles.container}>
      <View>
        {NodeDefs.isRoot(entityDef) && activeChildIndex === 0 && (
          <Button
            icon="format-list-bulleted"
            textKey="dataEntry:listOfRecords"
            onPress={() => {
              dispatch(DataEntryActions.navigateToRecordsList({ navigation }));
            }}
          />
        )}
        {activeChildIndex > 0 && (
          <SingleNodeNavigationButton
            icon="chevron-left"
            childDefIndex={activeChildIndex - 1}
          />
        )}
      </View>
      <View>
        {activeChildIndex < childDefs.length && (
          <SingleNodeNavigationButton
            icon="chevron-right"
            childDefIndex={activeChildIndex + 1}
          />
        )}
      </View>
    </HView>
  );
};
