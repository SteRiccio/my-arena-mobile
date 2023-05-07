import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

import { NodeDefs, Nodes, Records, Surveys } from "@openforis/arena-core";

import { useKeyboardIsVisible } from "hooks";
import { Button, HView, View } from "components";
import { DataEntrySelectors, SurveySelectors } from "state";
import { NodePageNavigationButton } from "./NodePageNavigationButton";
import { screenKeys } from "../../screenKeys";

import styles from "./styles";

export const NodePageNavigationBar = () => {
  const navigation = useNavigation();
  const keyboardVisible = useKeyboardIsVisible();
  const survey = SurveySelectors.useCurrentSurvey();
  const record = DataEntrySelectors.useRecord();

  const { parentEntityUuid, entityDef, entityUuid } =
    DataEntrySelectors.useCurrentPageEntity();

  if (__DEV__) {
    console.log(
      `rendering NodePageNavigationBar for ${NodeDefs.getName(entityDef)}`
    );
  }

  const parentEntityDef = Surveys.getNodeDefParent({
    survey,
    nodeDef: entityDef,
  });

  const getNextOrPrevSiblingEntityDef = useCallback(
    ({ offset }) => {
      if (!parentEntityDef) {
        return null;
      }
      const siblingEntityDefs = Surveys.getNodeDefChildren({
        survey,
        nodeDef: parentEntityDef,
        includeAnalysis: false,
      }).filter(NodeDefs.isEntity);

      const currentEntityDefIndex = siblingEntityDefs.indexOf(entityDef);
      const siblingEntityDef =
        siblingEntityDefs[currentEntityDefIndex + offset];
      if (siblingEntityDef) {
        return siblingEntityDef;
      }
      if (entityUuid) {
        return entityDef;
      }
      return parentEntityDef;
    },
    [entityDef, parentEntityDef, survey]
  );

  const getNextEntityDef = useCallback(() => {
    if (NodeDefs.isMultiple(entityDef) && !entityUuid) {
      return null;
    }
    const actualEntityUuid = entityUuid || parentEntityUuid;
    const actualEntity = Records.getNodeByUuid(actualEntityUuid)(record);

    const childrenEntityDefs = Surveys.getNodeDefChildren({
      survey,
      nodeDef: entityDef,
      includeAnalysis: false,
    }).filter(
      (childEntityDef) =>
        NodeDefs.isEntity(childEntityDef) &&
        Nodes.isChildApplicable(actualEntity, childEntityDef.uuid)
    );

    if (childrenEntityDefs.length > 0) {
      return childrenEntityDefs[0];
    }

    return getNextOrPrevSiblingEntityDef({ offset: 1 });
  }, [
    survey,
    entityDef,
    entityUuid,
    parentEntityUuid,
    record,
    getNextOrPrevSiblingEntityDef,
  ]);

  const nextEntityDef = getNextEntityDef();

  const getPrevEntityDef = useCallback(() => {
    if (!parentEntityDef) {
      return null;
    }
    if (NodeDefs.isMultiple(entityDef) && entityUuid) {
      return entityDef;
    }
    const next = getNextOrPrevSiblingEntityDef({ offset: -1 });
    return next === entityDef ? parentEntityDef : next;
  }, [survey, entityDef, entityUuid, getNextOrPrevSiblingEntityDef]);

  const prevEntityDef = getPrevEntityDef();

  if (keyboardVisible) {
    return null;
  }

  return (
    <HView style={styles.container}>
      <View>
        {NodeDefs.isRoot(entityDef) && (
          <Button
            icon="format-list-bulleted"
            textKey="List of records"
            onPress={() => navigation.navigate(screenKeys.recordsList)}
          />
        )}
        {prevEntityDef && (
          <NodePageNavigationButton
            icon={
              prevEntityDef === entityDef
                ? "format-list-bulleted"
                : "chevron-left"
            }
            entityDef={prevEntityDef}
          />
        )}
      </View>
      <View>
        {nextEntityDef && nextEntityDef !== prevEntityDef && (
          <NodePageNavigationButton
            icon="chevron-right"
            entityDef={nextEntityDef}
          />
        )}
      </View>
    </HView>
  );
};
