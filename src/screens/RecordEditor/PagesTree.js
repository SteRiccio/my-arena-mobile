import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import TreeView from "react-native-final-tree-view";

import { NodeDefs, Surveys } from "@openforis/arena-core";

import { Button } from "../../components";
import { SurveySelectors } from "../../state/survey/selectors";
import { DataEntrySelectors } from "../../state/dataEntry/selectors";
import { DataEntryActions } from "../../state/dataEntry/actions";

const getAncestorMultipleEntityDef = (nodeDef) => (survey) => {
  let currentParentDef = Surveys.getNodeDefParent({ survey, nodeDef });
  while (currentParentDef && NodeDefs.isSingle(currentParentDef)) {
    currentParentDef = Surveys.getNodeDefParent({
      survey,
      nodeDef: currentParentDef,
    });
  }
  return currentParentDef
    ? currentParentDef
    : Surveys.getNodeDefRoot({ survey });
};

const buildData = ({ survey, cycle, currentPageNode }) => {
  const createTreeItem = (nodeDef) => ({
    id: nodeDef.uuid,
    name: nodeDef.props.name,
    children: [],
  });

  const rootDef = Surveys.getNodeDefRoot({ survey });

  const rootTreeItem = createTreeItem(rootDef);

  const stack = [{ treeItem: rootTreeItem, nodeDef: rootDef }];

  while (stack.length) {
    const { treeItem: parentTreeItem, nodeDef: visitedNodeDef } = stack.pop();

    Surveys.getNodeDefChildren({
      survey,
      nodeDef: visitedNodeDef,
      includeAnalysis: false,
    }).forEach((childDef) => {
      if (
        currentPageNode.nodeDef.uuid === childDef.uuid ||
        (NodeDefs.isEntity(childDef) &&
          (NodeDefs.isSingle(childDef) ||
            getAncestorMultipleEntityDef(childDef)(survey).uuid ===
              currentPageNode.nodeDef.uuid))
      ) {
        const treeItem = createTreeItem(childDef);
        parentTreeItem.children.push(treeItem);
        stack.push({ treeItem, nodeDef: childDef });
      }
    });
  }

  return [rootTreeItem];
};

const NodeRenderer = ({ node, level, isExpanded, hasChildrenNodes }) => {
  const dispatch = useDispatch();

  const getIndicator = ({ isExpanded, hasChildrenNodes }) => {
    if (!hasChildrenNodes) {
      return " ";
    }
    if (isExpanded) {
      return "-";
    }
    return "+";
  };

  const onPress = useCallback(() => {
    dispatch(
      DataEntryActions.selectCurrentPageNode({
        nodeDefUuid: node.id,
      })
    );
    dispatch(DataEntryActions.toggleRecordPageMenuOpen);
  }, [node]);

  return (
    <Button
      contentStyle={{
        marginLeft: 25 * level,
        fontSize: 18,
      }}
      mode="text"
      onPress={hasChildrenNodes ? undefined : onPress}
    >
      {getIndicator({ isExpanded, hasChildrenNodes })} {node.name}
    </Button>
  );
};

export const PagesTree = () => {
  const survey = SurveySelectors.useCurrentSurvey();
  const cycle = DataEntrySelectors.useRecordCycle();
  const currentPageNode = DataEntrySelectors.useCurrentPageNode();

  const data = useMemo(
    () => buildData({ survey, cycle, currentPageNode }),
    [survey, cycle]
  );

  return <TreeView data={data} renderNode={NodeRenderer} />;
};
