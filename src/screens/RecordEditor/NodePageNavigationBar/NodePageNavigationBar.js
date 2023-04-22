import React, { useCallback } from "react";

import { NodeDefs, Nodes, Records, Surveys } from "@openforis/arena-core";

import { useKeyboardIsVisible } from "../../../hooks";
import { HView, View } from "../../../components";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { SurveySelectors } from "../../../state/survey/selectors";
import { NodePageNavigationButton } from "./NodePageNavigationButton";
import styles from "./styles";

export const NodePageNavigationBar = () => {
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
    if (NodeDefs.isMultiple(entityDef) && !entityUuid) {
      return parentEntityDef;
    }
    if (parentEntityDef && entityUuid) {
      return entityDef;
    }
    return getNextOrPrevSiblingEntityDef({ offset: -1 });
  }, [survey, entityDef, entityUuid, getNextOrPrevSiblingEntityDef]);

  const prevEntityDef = getPrevEntityDef();

  if (keyboardVisible) {
    return null;
  }

  return (
    <HView style={styles.container}>
      <View>
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
