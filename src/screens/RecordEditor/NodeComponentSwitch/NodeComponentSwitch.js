import { NodeDefType, NodeDefs } from "@openforis/arena-core";

import { Text } from "components";
import { NodeMultipleEntityPreviewComponent } from "./nodeTypes/NodeMultipleEntityPreviewComponent";
import { NodeSingleEntityComponent } from "./nodeTypes/NodeSingleEntityComponent";

import { SingleAttributeComponentSwitch } from "./SingleAttributeComponentSwitch";
import { NodeCodeComponent } from "./nodeTypes/NodeCodeComponent";

export const NodeComponentSwitch = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeComponentSwitch for ${nodeDef.props.name}`);
  }

  if (NodeDefs.isSingleEntity(nodeDef)) {
    return (
      <NodeSingleEntityComponent
        nodeDef={nodeDef}
        parentNodeUuid={parentNodeUuid}
      />
    );
  }

  if (NodeDefs.isMultipleEntity(nodeDef)) {
    return (
      <NodeMultipleEntityPreviewComponent
        nodeDef={nodeDef}
        parentNodeUuid={parentNodeUuid}
      />
    );
  }

  if (NodeDefs.isSingle(nodeDef) && NodeDefs.isAttribute(nodeDef)) {
    return (
      <SingleAttributeComponentSwitch
        nodeDef={nodeDef}
        parentNodeUuid={parentNodeUuid}
      />
    );
  }

  if (NodeDefs.isMultiple(nodeDef) && nodeDef.type === NodeDefType.code) {
    return (
      <NodeCodeComponent nodeDef={nodeDef} parentNodeUuid={parentNodeUuid} />
    );
  }

  return (
    <Text
      textKey={`Multiple nodes not supported (${nodeDef.props.name} - ${nodeDef.type})`}
    />
  );
};
