import { NodeDefs, Records, Surveys } from "@openforis/arena-core";

const determineEntity = ({ survey, record, currentPageEntity, entityDef }) => {
  if (NodeDefs.isRoot(entityDef)) {
    return null;
  }
  const {
    parentEntityUuid: currentParentEntityUuid,
    entityDef: currentEntityDef,
    entityUuid: currentEntityUuid,
  } = currentPageEntity;

  const currentParentEntity = currentParentEntityUuid
    ? Records.getNodeByUuid(currentParentEntityUuid)(record)
    : null;

  const currentEntity = currentEntityUuid
    ? Records.getNodeByUuid(currentEntityUuid)(record)
    : null;

  if (currentEntityDef.uuid === entityDef.uuid) {
    if (NodeDefs.isMultiple(entityDef)) {
      return currentParentEntity;
    }
    return currentEntity || currentParentEntity;
  }

  const root = Records.getRoot(record);
  if (
    Surveys.isNodeDefAncestor({
      nodeDefAncestor: entityDef,
      nodeDefDescendant: currentEntityDef,
    })
  ) {
    // ancestor entity
    const ancestorEntity = Records.getAncestor({
      record,
      ancestorDefUuid: entityDef.uuid,
      node: currentParentEntity || root,
    });

    return ancestorEntity;
  }
  // descendant entity
  if (NodeDefs.isMultiple(entityDef)) {
    // pointer to list of entities
    const parentEntityDef = Surveys.getNodeDefParent({
      survey,
      nodeDef: entityDef,
    });
    return Records.getDescendant({
      record,
      node: currentParentEntity || root,
      nodeDefDescendant: parentEntityDef,
    });
  }
  return Records.getDescendant({
    record,
    node: currentParentEntity || root,
    nodeDefDescendant: entityDef,
  });
};

export const determinePageEntity = ({
  survey,
  record,
  currentPageEntity,
  entityDefUuid,
  entityUuid = null,
}) => {
  const { entityDef: currentEntityDef, entityUuid: prevEntityUuid } =
    currentPageEntity;

  if (
    entityDefUuid === currentEntityDef.uuid &&
    entityUuid === prevEntityUuid
  ) {
    // NO CHANGE (same record entity page)
    return null;
  }

  const entityDef = Surveys.getNodeDefByUuid({ survey, uuid: entityDefUuid });

  const root = Records.getRoot(record);

  if (NodeDefs.isRoot(entityDef)) {
    // ROOT
    return {
      parentEntityUuid: null,
      entityDef,
      entityUuid: root.uuid,
    };
  }

  const entity = determineEntity({
    survey,
    record,
    currentPageEntity,
    entityDef,
  });
  if (!entity) return null;

  const pointerToListOfEntities = entity.nodeDefUuid !== entityDef.uuid;

  const parentEntity = Records.getParent(entity)(record);

  return {
    parentEntityUuid: pointerToListOfEntities ? entity.uuid : parentEntity.uuid,
    entityDef,
    entityUuid: entityUuid || (pointerToListOfEntities ? null : entity.uuid),
  };
};

export const RecordPageNavigator = {
  determinePageEntity,
};
