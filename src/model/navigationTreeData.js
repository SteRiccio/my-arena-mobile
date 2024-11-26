import { Records, Surveys } from "@openforis/arena-core";
import { RecordNodes } from "./utils/RecordNodes";

const getChildEntity = ({ record, entity, currentEntity, childDef }) => {
  if (NodeDefs.isSingle(childDef)) {
    return Records.getChild(entity, childDef.uuid)(record);
  }
  const currentEntityAndAncestorUuids = [
    ...Nodes.getHierarchy(currentEntity),
    currentEntity.uuid,
  ];
  const children = Records.getChildren(entity, childDef.uuid)(record);
  return children.find((child) =>
    currentEntityAndAncestorUuids.includes(child.uuid)
  );
};

const isEntityDefIncluded =
  ({ visitedEntityDef, currentEntityDef }) =>
  (entityDef) =>
    Surveys.isNodeDefAncestor({
      nodeDefAncestor: visitedEntityDef,
      nodeDefDescendant: currentEntityDef,
    }) ||
    // is current entity def
    entityDef.uuid === currentEntityDef.uuid ||
    // is sibling of current entity def
    entityDef.parentUuid === currentEntityDef.parentUuid ||
    // is child of current entity def
    entityDef.parentUuid === currentEntityDef.uuid;

const buildTreeData = ({
  survey,
  record,
  currentEntityDef,
  currentEntityUuid,
}) => {
  const currentEntity = Records.getNodeByUuid(currentEntityUuid)(record);
  const { cycle } = record;

  const createTreeItem = ({ nodeDefUuid, parentEntityUuid, entityUuid }) => ({
    nodeDefUuid,
    isRoot: !parentEntityUuid,
    children: [],
    entityPointer: {
      entityDefUuid: nodeDefUuid,
      parentEntityUuid,
      entityUuid,
    },
  });

  const rootDef = Surveys.getNodeDefRoot({ survey });
  const rootNode = Records.getRoot(record);

  const rootTreeItem = createTreeItem({
    nodeDefUuid: rootDef.uuid,
    parentEntityUuid: null,
    entityUuid: rootNode.uuid,
  });

  const stack = [
    { treeItem: rootTreeItem, entityDef: rootDef, entity: rootNode },
  ];

  const treeItemsByNodeDefUuid = {};
  treeItemsByNodeDefUuid[rootDef.uuid] = rootTreeItem;

  while (stack.length) {
    const {
      treeItem: parentTreeItem,
      entityDef: visitedEntityDef,
      entity: visitedEntity,
    } = stack.pop();

    const applicableChildrenEntityDefs =
      RecordNodes.getApplicableChildrenEntityDefs({
        survey,
        cycle,
        nodeDef: visitedEntityDef,
        parentEntity: visitedEntity,
      }).filter(isEntityDefIncluded({ visitedEntityDef, currentEntityDef }));

    applicableChildrenEntityDefs.forEach((childDef) => {
      const childEntity = getChildEntity({
        record,
        entity: visitedEntity,
        childDef,
        currentEntity,
      });

      const treeItem = createTreeItem({
        nodeDefUuid: childDef.uuid,
        parentEntityUuid: visitedEntity.uuid,
        entityUuid: childEntity?.uuid,
      });

      parentTreeItem.children.push(treeItem);

      treeItemsByNodeDefUuid[treeItem.nodeDefUuid] = treeItem;

      if (childEntity) {
        stack.push({ treeItem, entityDef: childDef, entity: childEntity });
      }
    });
  }
};

export const NavigationTreeData = {
  buildTreeData,
};
