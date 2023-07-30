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
  const { isCurrentEntity, isRoot } = treeNode;

  return (
    <HView
      style={{
        marginLeft: isRoot ? 0 : 20 * (level - 1),
        fontSize: 18,
        gap: 2,
        height: 30,
        backgroundColor: "transparent",
        alignItems: "center",
      }}
    >
      {!isRoot && (
        <Indicator
          isExpanded={isExpanded}
          hasChildrenNodes={hasChildrenNodes}
        />
      )}
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
