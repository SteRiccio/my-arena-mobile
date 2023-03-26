import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import TreeView from "react-native-final-tree-view";

import { NodeDefs, Surveys } from "@openforis/arena-core";

import { Button, HView, Text } from "../../components";
import { SurveySelectors } from "../../state/survey/selectors";
import { DataEntrySelectors } from "../../state/dataEntry/selectors";
import { DataEntryActions } from "../../state/dataEntry/actions";

const buildData = ({ survey, cycle, currentPageNode }) => {
  const createTreeItem = (nodeDef) => ({
    id: nodeDef.uuid,
    name: nodeDef.props.name,
    children: [],
  });

  const currentNodeDef = currentPageNode.nodeDef;

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
        currentNodeDef.uuid === childDef.uuid ||
        (NodeDefs.isEntity(childDef) &&
          Surveys.getNodeDefParent({ survey, nodeDef: childDef }) ===
            currentNodeDef)
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
    <HView
      style={{
        marginLeft: 25 * level,
        fontSize: 18,
      }}
    >
      <Text textKey={getIndicator({ isExpanded, hasChildrenNodes })} />
      <Button mode="text" onPress={onPress}>
        {node.name}
      </Button>
    </HView>
  );
};

export const PagesTree = () => {
  const survey = SurveySelectors.useCurrentSurvey();
  const cycle = DataEntrySelectors.useRecordCycle();
  const currentPageNode = DataEntrySelectors.useCurrentPageNode();
  const currentNodeDef = currentPageNode.nodeDef;

  const data = useMemo(
    () => buildData({ survey, cycle, currentPageNode }),
    [survey, cycle]
  );

  const isNodeExpanded = (nodeDefUuid) => {
    const nodeDef = Surveys.getNodeDefByUuid({ survey, uuid: nodeDefUuid });
    return (
      nodeDef === currentNodeDef ||
      Surveys.isNodeDefAncestor({
        nodeDefAncestor: nodeDef,
        nodeDefDescendant: currentNodeDef,
      })
    );
  };

  return (
    <TreeView
      data={data}
      isNodeExpanded={isNodeExpanded}
      renderNode={NodeRenderer}
    />
  );
};
