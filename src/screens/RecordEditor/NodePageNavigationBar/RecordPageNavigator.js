import { Surveys, Records, NodeDefs } from "@openforis/arena-core";

const getSingleChildNodeUuid = ({ record, entityDef, parentEntity }) =>
  NodeDefs.isMultiple(entityDef)
    ? null
    : Records.getChild(parentEntity, entityDef.uuid)(record)?.uuid;

const getAncestorMultipleEntity = ({ survey, record, entity }) => {
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
};

const getNextOrPreviousMultipleEntityPointer = ({
  survey,
  record,
  entity,
  offset,
}) => {
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
};

const getNextOrPrevSiblingEntityPointer = ({
  entityDef,
  entityUuid,
  parentEntityDef,
  parentEntity,
  survey,
  offset,
}) => {
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
  const siblingEntityDef = siblingEntityDefs[currentEntityDefIndex + offset];

  if (!siblingEntityDef) return null;

  return {
    parentEntityUuid,
    entityDef: siblingEntityDef,
    entityUuid: getSingleChildNodeUuid({
      entityDef: siblingEntityDef,
      parentEntity,
    }),
  };
};

const getNextEntityPointer = ({
  survey,
  entityDef,
  entityUuid,
  actualEntity,
}) => {
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
  const ancestorMultipleEntityPointer = getNextOrPreviousMultipleEntityPointer({
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
};

const getPrevEntityPointer = (
  record,
  entityDef,
  entityUuid,
  parentEntityDef,
  parentEntityUuid
) => {
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
};

export const RecordPageNavigator = {
  getNextEntityPointer,
  getPrevEntityPointer,
};
