import { NodeDefs, Nodes, Records, Surveys } from "@openforis/arena-core";

import { RecordNodes } from "model/utils/RecordNodes";

import { DataEntrySelectors, SurveySelectors } from "state";

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

export const useTreeData = () => {
  const survey = SurveySelectors.useCurrentSurvey();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const record = DataEntrySelectors.useRecord();
  // const cycle = DataEntrySelectors.useRecordCycle();
  const currentPageEntity = DataEntrySelectors.useCurrentPageEntity();
  const {
    entityDef: currentEntityDef,
    entityUuid,
    parentEntityUuid,
  } = currentPageEntity;

  const currentEntityUuid = entityUuid || parentEntityUuid;
  const currentEntity = Records.getNodeByUuid(currentEntityUuid)(record);

  const createTreeItem = ({ nodeDef, parentEntityUuid, entityUuid }) => ({
    id: nodeDef.uuid,
    label: NodeDefs.getLabelOrName(nodeDef, lang),
    children: [],
    isCurrentEntity: nodeDef.uuid === currentEntityDef.uuid,
    entityPointer: {
      entityDefUuid: nodeDef.uuid,
      parentEntityUuid,
      entityUuid,
    },
  });

  const rootDef = Surveys.getNodeDefRoot({ survey });
  const rootNode = Records.getRoot(record);

  const rootTreeItem = createTreeItem({
    nodeDef: rootDef,
    parentEntityUuid: null,
    entityUuid: rootNode.uuid,
  });

  const stack = [
    { treeItem: rootTreeItem, entityDef: rootDef, entity: rootNode },
  ];

  while (stack.length) {
    const {
      treeItem: parentTreeItem,
      entityDef: visitedEntityDef,
      entity: visitedEntity,
    } = stack.pop();

    const applicableChildrenEntityDefs = RecordNodes.getApplicableChildrenDefs({
      survey,
      nodeDef: visitedEntityDef,
      parentEntity: visitedEntity,
    }).filter(
      (childDef) =>
        NodeDefs.isEntity(childDef) &&
        (Surveys.isNodeDefAncestor({
          nodeDefAncestor: visitedEntityDef,
          nodeDefDescendant: currentEntityDef,
        }) ||
          // is current entity def
          childDef.uuid === currentEntityDef.uuid ||
          // is sibling of current entity def
          childDef.parentUuid === currentEntityDef.parentUuid ||
          // is child of current entity def
          childDef.parentUuid === currentEntityDef.uuid)
    );

    applicableChildrenEntityDefs.forEach((childDef) => {
      const childEntity = getChildEntity({
        record,
        entity: visitedEntity,
        childDef,
        currentEntity,
      });

      const treeItem = createTreeItem({
        nodeDef: childDef,
        parentEntityUuid: visitedEntity.uuid,
        entityUuid: childEntity?.uuid,
      });

      parentTreeItem.children.push(treeItem);

      if (childEntity) {
        stack.push({ treeItem, entityDef: childDef, entity: childEntity });
      }
    });
  }

  return [rootTreeItem];
};
