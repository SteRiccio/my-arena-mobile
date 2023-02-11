import { useMemo } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import TreeView from "react-native-final-tree-view";

import { NodeDefs, Surveys } from "@openforis/arena-core";
import { SurveySelectors } from "../../state/survey/selectors";
import { DataEntrySelectors } from "../../state/dataEntry/selectors";

const buildData = ({ survey, cycle }) => {
  const rootDef = Surveys.getNodeDefRoot({ survey });

  const createTreeItem = (nodeDef) => ({
    id: nodeDef.uuid,
    name: nodeDef.props.name,
    children: [],
  });
  const rootTreeItem = createTreeItem(rootDef);

  const stack = [{ treeItem: rootTreeItem, nodeDef: rootDef }];

  while (stack.length) {
    const { treeItem: parentTreeItem, nodeDef: currentNodeDef } = stack.pop();

    const childrenDefsWithOwnPage = Surveys.getNodeDefChildren({
      survey,
      nodeDef: currentNodeDef,
      includeAnalysis: false,
    }).filter((childDef) => NodeDefs.getLayoutProps(cycle)(childDef).pageUuid);

    childrenDefsWithOwnPage.forEach((childDef) => {
      const treeItem = createTreeItem(childDef);
      parentTreeItem.children.push(treeItem);
      stack.push({ treeItem, nodeDef: childDef });
    });
  }

  return [rootTreeItem];
};

export const PagesTree = () => {
  const survey = SurveySelectors.useCurrentSurvey();
  const cycle = DataEntrySelectors.useRecordCycle();

  const data = useMemo(() => buildData({ survey, cycle }), [survey, cycle]);

  const getIndicator = ({ isExpanded, hasChildrenNodes }) => {
    if (!hasChildrenNodes) {
      return "*";
    }
    if (isExpanded) {
      return "-";
    }
    return "+";
  };

  return (
    <TreeView
      data={data}
      renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
        return (
          <View>
            <Text
              style={{
                marginLeft: 25 * level,
                fontSize: 18,
              }}
            >
              {getIndicator({ isExpanded, hasChildrenNodes })} {node.name}
            </Text>
          </View>
        );
      }}
    />
  );
};
