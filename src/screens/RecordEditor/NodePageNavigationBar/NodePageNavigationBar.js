import React, { useCallback } from "react";

import { NodeDefs, Nodes, Surveys } from "@openforis/arena-core";

import { HView } from "../../../components";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { SurveySelectors } from "../../../state/survey/selectors";
import { NodePageNavigationButton } from "./NodePageNavigationButton";
import { useKeyboardIsVisible } from "./useKeyboardIsVisible";
import styles from "./styles";

export const NodePageNavigationBar = () => {
  const survey = SurveySelectors.useCurrentSurvey();
  const keyboardVisible = useKeyboardIsVisible();

  const { parentEntity, entityDef, entity } =
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
      if (entity) {
        return entityDef;
      }
      return parentEntityDef;
    },
    [entityDef, parentEntityDef, survey]
  );

  const getNextEntityDef = () => {
    if (NodeDefs.isMultiple(entityDef) && !entity) {
      return null;
    }
    const actualEntity = entity || parentEntity;
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
  };

  const nextEntityDef = getNextEntityDef();

  const getPrevEntityDef = () => {
    if (!parentEntityDef) {
      return null;
    }
    if (NodeDefs.isMultiple(entityDef) && !entity) {
      return parentEntityDef;
    }
    if (parentEntityDef && entity) {
      return entityDef;
    }
    return getNextOrPrevSiblingEntityDef({ offset: -1 });
  };

  const prevEntityDef = getPrevEntityDef();

  if (keyboardVisible) {
    return null;
  }

  return (
    <HView style={styles.container}>
      {prevEntityDef && (
        <NodePageNavigationButton
          icon={
            prevEntityDef === entityDef
              ? "format-list-bulleted"
              : "chevron-left"
          }
          entityDef={prevEntityDef}
          style={{ alignSelf: "flex-start" }}
        />
      )}
      {nextEntityDef && nextEntityDef !== prevEntityDef && (
        <NodePageNavigationButton
          icon="chevron-right"
          entityDef={nextEntityDef}
          style={{ alignSelf: "flex-end" }}
        />
      )}
    </HView>
  );
};
