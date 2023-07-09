import TreeView from "react-native-final-tree-view";

import { HView, ScrollView } from "components";

import { EntityButton } from "./EntityButton";
import { Indicator } from "./Indicator";
import { useTreeData } from "./useTreeData";

const TreeNodeRenderer = ({
  node: treeNode,
  level,
  isExpanded,
  hasChildrenNodes,
}) => {
  const { isCurrentEntity } = treeNode;

  return (
    <HView
      style={{
        marginLeft: 25 * level,
        fontSize: 18,
        gap: 20,
        height: 30,
        backgroundColor: "transparent",
        alignItems: "center",
      }}
    >
      <Indicator isExpanded={isExpanded} hasChildrenNodes={hasChildrenNodes} />
      <EntityButton treeNode={treeNode} isCurrentEntity={isCurrentEntity} />
    </HView>
  );
};

export const PagesNavigationTree = () => {
  const data = useTreeData();

  return (
    <ScrollView
      showsVerticalScrollIndicator
      style={{ flex: 1, backgroundColor: "transparent" }}
    >
      <TreeView data={data} initialExpanded renderNode={TreeNodeRenderer} />
    </ScrollView>
  );
};
