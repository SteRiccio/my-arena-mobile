import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { NodeDefs, Nodes, Records, Surveys } from "@openforis/arena-core";

import { Button, HView, IconButton } from "../../../components";
import { DataEntryActions } from "../../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { SurveySelectors } from "../../../state/survey/selectors";

export const NodePageNavigationBar = () => {
  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();

  const { parentEntity, entityDef, entity } =
    DataEntrySelectors.useCurrentPageEntity();

  const parentEntityDef = Surveys.getNodeDefParent({
    survey,
    nodeDef: entityDef,
  });

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
    const siblingEntityDefs = Surveys.getNodeDefChildren({
      survey,
      nodeDef: parentEntityDef,
      includeAnalysis: false,
    }).filter(NodeDefs.isEntity);

    const currentEntityDefIndex = siblingEntityDefs.indexOf(entityDef);
    const nextEntityDefIndex = currentEntityDefIndex + 1;
    const nextSiblingEntityDef = siblingEntityDefs[nextEntityDefIndex];
    if (nextSiblingEntityDef) {
      return nextSiblingEntityDef;
    }
    if (entity) {
      return entityDef;
    }
    return parentEntityDef;
  };

  const nextEntityDef = getNextEntityDef();

  if (__DEV__) {
    console.log(
      `rendering NodePageNavigationBar for ${NodeDefs.getName(entityDef)}`
    );
  }

  return (
    <HView>
      {entityDef && entity && parentEntityDef && (
        <Button
          icon="format-list-bulleted"
          textKey={`List of ${NodeDefs.getName(entityDef)}`}
          onPress={() =>
            dispatch(
              DataEntryActions.selectCurrentPageEntity({
                entityDefUuid: entityDef.uuid,
              })
            )
          }
        />
      )}
      {nextEntityDef && (
        <Button
          icon="chevron-right"
          textKey={NodeDefs.getName(nextEntityDef)}
          onPress={() =>
            dispatch(
              DataEntryActions.selectCurrentPageEntity({
                entityDefUuid: nextEntityDef.uuid,
              })
            )
          }
        />
      )}
    </HView>
  );
};
