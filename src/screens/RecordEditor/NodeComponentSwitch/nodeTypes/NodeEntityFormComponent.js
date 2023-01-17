import { View } from "react-native";

import { NodeDefFormItem } from "../../NodeDefFormItem";
import { DataEntrySelectors } from "../../../../state/dataEntry/selectors";

export const NodeEntityFormComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  console.log("rendering NodeDefEntityForm");

  const childrenDefs = DataEntrySelectors.useRecordEntityVisibleChildDefs({
    nodeDef,
  });

  return (
    <View
      style={[
        {
          flexDirection: "column",
        },
      ]}
    >
      {childrenDefs.map((childDef) => (
        <NodeDefFormItem
          key={childDef.uuid}
          nodeDef={childDef}
          parentNodeUuid={nodeUuid}
        />
      ))}
    </View>
  );
};
