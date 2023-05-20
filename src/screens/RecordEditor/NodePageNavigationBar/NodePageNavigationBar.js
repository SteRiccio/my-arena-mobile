import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

import { NodeDefs, Objects, Records, Surveys } from "@openforis/arena-core";

import { RecordNodes } from "model/utils/RecordNodes";
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

  const parentEntity = parentEntityUuid
    ? Records.getNodeByUuid(parentEntityUuid)(record)
    : null;
  const entity = entityUuid ? Records.getNodeByUuid(entityUuid)(record) : null;
  const actualEntity = entity || parentEntity;

  const getSingleChildNodeUuid = ({ entityDef, parentEntity }) =>
    NodeDefs.isMultiple(entityDef)
      ? null
      : Records.getChild(parentEntity, entityDef.uuid)(record)?.uuid;

  const getAncestorMultipleEntity = useCallback(
    ({ entity }) => {
      let currentEntity = entity;
      let currentEntityDef = Surveys.getNodeDefByUuid({
        survey,
        uuid: entity.nodeDefUuid,
      });
      while (
        !NodeDefs.isRoot(currentEntityDef) &&
        !NodeDefs.isMultiple(currentEntityDef)
      ) {
        currentEntity = Records.getParent(currentEntity)(record);
        currentEntityDef = Surveys.getNodeDefByUuid({
          survey,
          uuid: currentEntity.nodeDefUuid,
        });
      }
      return currentEntity;
    },
    [survey, record]
  );

  const getNextOrPreviousMultipleEntityPointer = useCallback(
    ({ entity, offset }) => {
      const parentEntity = Records.getParent(entity)(record);
      const entityDefUuid = entity.nodeDefUuid;
      const entityDef = Surveys.getNodeDefByUuid({
        survey,
        uuid: entityDefUuid,
      });
      const { siblingNode, index: siblingIndex } = RecordNodes.getSiblingNode({
        record,
        parentEntity,
        node: entity,
        offset,
      });

      if (!siblingNode) return null;

      return {
        parentEntityUuid: parentEntity.uuid,
        entityDef,
        entityUuid: siblingNode.uuid,
        index: siblingIndex,
      };
    },
    [record, survey]
  );

  const getNextOrPrevSiblingEntityPointer = useCallback(
    ({ offset }) => {
      if (!parentEntityDef) {
        return null;
      }
      if (NodeDefs.isMultiple(entityDef) && entityUuid) {
        return getNextOrPreviousMultipleEntityPointer({ entity, offset });
      }
      const siblingEntityDefs = RecordNodes.getApplicableChildrenDefs({
        survey,
        nodeDef: parentEntityDef,
        parentEntity,
      });
      const currentEntityDefIndex = siblingEntityDefs.indexOf(entityDef);
      const siblingEntityDef =
        siblingEntityDefs[currentEntityDefIndex + offset];

      if (!siblingEntityDef) return null;

      return {
        parentEntityUuid,
        entityDef: siblingEntityDef,
        entityUuid: getSingleChildNodeUuid({
          entityDef: siblingEntityDef,
          parentEntity,
        }),
      };
    },
    [
      entityDef,
      entityUuid,
      parentEntityDef,
      parentEntity,
      survey,
      getNextOrPreviousMultipleEntityPointer,
    ]
  );

  const getNextEntityPointer = useCallback(() => {
    if (entityUuid) {
      const childrenEntityDefs = RecordNodes.getApplicableChildrenDefs({
        survey,
        nodeDef: entityDef,
        parentEntity: actualEntity,
      });
      if (childrenEntityDefs.length > 0) {
        const firstChildEntityDef = childrenEntityDefs[0];
        return {
          parentEntityUuid: entityUuid,
          entityDef: firstChildEntityDef,
          entityUuid: getSingleChildNodeUuid({
            entityDef: firstChildEntityDef,
            parentEntity: actualEntity,
          }),
        };
      }
    }

    if (NodeDefs.isRoot(entityDef)) {
      return null;
    }

    const nextEntityPointer = getNextOrPrevSiblingEntityPointer({ offset: 1 });
    if (nextEntityPointer) {
      return nextEntityPointer;
    }

    const ancestorMultipleEntity = getAncestorMultipleEntity({ entity });
    const ancestorMultipleEntityPointer =
      getNextOrPreviousMultipleEntityPointer({
        entity: ancestorMultipleEntity,
        offset: 1,
      });
    if (ancestorMultipleEntityPointer) {
      return ancestorMultipleEntityPointer;
    }
    const ancestorMultipleEntityDef = Surveys.getNodeDefByUuid({
      survey,
      uuid: ancestorMultipleEntity.nodeDefUuid,
    });
    return {
      parentEntityUuid: ancestorMultipleEntity.parentUuid,
      entityDef: ancestorMultipleEntityDef,
      entityUuid: null,
    };
  }, [
    survey,
    entityDef,
    entityUuid,
    actualEntity,
    getNextOrPreviousMultipleEntityPointer,
    getNextOrPrevSiblingEntityPointer,
  ]);

  const getPrevEntityPointer = useCallback(() => {
    if (!parentEntityDef) {
      return null;
    }
    const prevPointer = getNextOrPrevSiblingEntityPointer({ offset: -1 });
    if (prevPointer !== null) {
      return prevPointer;
    }
    if (NodeDefs.isMultiple(entityDef) && entityUuid) {
      return {
        parentEntityUuid,
        entityDef,
        entityUuid: null,
      };
    }
    const ancestorEntity = Records.getParent(parentEntity)(record);
    return {
      parentEntityUuid: ancestorEntity?.uuid,
      entityDef: parentEntityDef,
      entityUuid: parentEntityUuid,
    };
  }, [
    survey,
    entityDef,
    entityUuid,
    parentEntityDef,
    parentEntityUuid,
    record,
    getNextOrPrevSiblingEntityPointer,
  ]);

  const prevEntityPointer = getPrevEntityPointer();
  const nextEntityPointer = getNextEntityPointer();

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
