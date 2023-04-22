import { NodeDefs, Nodes, Records, Surveys } from "@openforis/arena-core";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { SurveySelectors } from "../../../state/survey/selectors";

export const useTreeData = () => {
  const survey = SurveySelectors.useCurrentSurvey();
  const record = DataEntrySelectors.useRecord();
  // const cycle = DataEntrySelectors.useRecordCycle();
  const currentPageEntity = DataEntrySelectors.useCurrentPageEntity();
  const {
    entityDef: currentEntityDef,
    entityUuid,
    parentEntityUuid,
  } = currentPageEntity;

  const actualEntityUuid = entityUuid || parentEntityUuid;
  const actualEntity = Records.getNodeByUuid(actualEntityUuid)(record);

  const createTreeItem = (nodeDef) => ({
    id: nodeDef.uuid,
    name: nodeDef.props.name,
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
    }).forEach((childDef) => {
      if (
        NodeDefs.isEntity(childDef) &&
        (Surveys.isNodeDefAncestor({
          nodeDefAncestor: childDef,
          nodeDefDescendant: currentEntityDef,
        }) ||
          childDef.uuid === currentEntityDef.uuid ||
          (childDef.parentUuid === currentEntityDef.uuid &&
            Nodes.isChildApplicable(actualEntity, childDef.uuid)))
      ) {
        const treeItem = createTreeItem(childDef);
        parentTreeItem.children.push(treeItem);
        stack.push({ treeItem, entityDef: childDef });
      }
    });
  }

  return [rootTreeItem];
};
