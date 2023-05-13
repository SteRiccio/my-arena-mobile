import { NodeDefs, Nodes, Records, Surveys } from "@openforis/arena-core";
import { DataEntrySelectors, SurveySelectors } from "state";

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

  const createTreeItem = (nodeDef) => ({
    id: nodeDef.uuid,
    name: NodeDefs.getLabelOrName(nodeDef, lang),
    children: [],
    isCurrentEntity: nodeDef.uuid === currentEntityDef.uuid,
  });

  const rootDef = Surveys.getNodeDefRoot({ survey });

  const rootTreeItem = createTreeItem(rootDef);

  const stack = [{ treeItem: rootTreeItem, entityDef: rootDef }];

  while (stack.length) {
    const { treeItem: parentTreeItem, entityDef: visitedEntityDef } =
      stack.pop();

    Surveys.getNodeDefChildren({
      survey,
      nodeDef: visitedEntityDef,
      includeAnalysis: false,
    })
      .filter(
        (childDef) =>
          NodeDefs.isEntity(childDef) &&
          (Surveys.isNodeDefAncestor({
            nodeDefAncestor: childDef,
            nodeDefDescendant: currentEntityDef,
          }) ||
            childDef.uuid === currentEntityDef.uuid ||
            ((childDef.parentUuid === currentEntityDef.parentUuid ||
              childDef.parentUuid === currentEntityDef.uuid) &&
              Nodes.isChildApplicable(currentEntity, childDef.uuid)))
      )
      .forEach((childDef) => {
        const treeItem = createTreeItem(childDef);
        parentTreeItem.children.push(treeItem);
        stack.push({ treeItem, entityDef: childDef });
      });
  }

  return [rootTreeItem];
};
