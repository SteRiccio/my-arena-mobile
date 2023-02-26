import { NodeDefFormItem } from "../../NodeDefFormItem";
import { DataEntrySelectors } from "../../../../state/dataEntry/selectors";
import { VView } from "../../../../components";

export const NodeEntityFormComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log("rendering NodeDefEntityForm");
  }
  const childrenDefs = DataEntrySelectors.useRecordEntityVisibleChildDefs({
    nodeDef,
  });

  return (
    <VView>
      {childrenDefs.map((childDef) => (
        <NodeDefFormItem
          key={childDef.uuid}
          nodeDef={childDef}
          parentNodeUuid={nodeUuid}
        />
      ))}
    </VView>
  );
};
