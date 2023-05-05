import TreeView from "react-native-final-tree-view";

import { HView } from "components";

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
      }}
    >
      <Indicator isExpanded={isExpanded} hasChildrenNodes={hasChildrenNodes} />
      <EntityButton treeNode={treeNode} isCurrentEntity={isCurrentEntity} />
    </HView>
  );
};

export const PagesTree = () => {
  const data = useTreeData();

  return (
    <TreeView
      data={data}
      initialExpanded={true}
      renderNode={TreeNodeRenderer}
    />
  );
};
