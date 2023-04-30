import { NodeDefs, Records, Surveys } from "@openforis/arena-core";

const determineParentEntity = ({
  survey,
  record,
  currentPageEntity,
  entityDef,
}) => {
  if (NodeDefs.isRoot(entityDef)) {
    return null;
  }
  const {
    parentEntityUuid: currentParentEntityUuid,
    entityDef: currentEntityDef,
  } = currentPageEntity;

  const currentParentEntity = currentParentEntityUuid
    ? Records.getNodeByUuid(currentParentEntityUuid)(record)
    : null;

  if (currentEntityDef.uuid === entityDef.uuid) {
    return currentParentEntity;
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

    if (!ancestorEntity) {
      // ERROR
      return null;
    }
    return Records.getParent(ancestorEntity)(record);
  }
  // descendant entity
  const parentEntityDef = Surveys.getNodeDefParent({
    survey,
    nodeDef: entityDef,
  });
  const descendantParentEntity = Records.getDescendant({
    record,
    node: currentParentEntity || root,
    nodeDefDescendant: parentEntityDef,
  });
  return descendantParentEntity;
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

  const parentEntity = determineParentEntity({
    survey,
    record,
    currentPageEntity,
    entityDef,
  });
  if (!parentEntity) return null;

  if (NodeDefs.isSingle(entityDef)) {
    return {
      parentEntityUuid: parentEntity.uuid,
      entityDef,
      entityUuid: Records.getChild(parentEntity, entityDefUuid)(record)?.uuid,
    };
  }
  return {
    parentEntityUuid: parentEntity.uuid,
    entityDef,
    entityUuid,
  };
};

export const RecordPageNavigator = {
  determinePageEntity,
};
