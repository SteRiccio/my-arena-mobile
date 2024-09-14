import { useCallback } from "react";
import { useDispatch } from "react-redux";
import TreeView from "react-native-final-tree-view";

import { HView, ScrollView } from "components";
import { DataEntryActions } from "state";

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
  const dispatch = useDispatch();

  const onNodePress = useCallback(({ node: treeNode }) => {
    const { entityPointer } = treeNode;
    dispatch(DataEntryActions.selectCurrentPageEntity(entityPointer));
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator
      style={{ flex: 1, backgroundColor: "transparent" }}
    >
      <TreeView
        data={data}
        initialExpanded
        onNodePress={onNodePress}
        renderNode={TreeNodeRenderer}
      />
    </ScrollView>
  );
};
