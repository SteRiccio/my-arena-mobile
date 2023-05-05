import { NodeDefType, NodeDefs } from "@openforis/arena-core";

import { NodeCodeComponent } from "./nodeTypes/NodeCodeComponent";
import { NodeMultipleEntityPreviewComponent } from "./nodeTypes/NodeMultipleEntityPreviewComponent";
import { NodeSingleEntityComponent } from "./nodeTypes/NodeSingleEntityComponent";

import { SingleAttributeComponentSwitch } from "./SingleAttributeComponentSwitch";
import { MultipleAttributeComponentWrapper } from "./MultipleAttributeComponentWrapper";

export const NodeComponentSwitch = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeComponentSwitch for ${nodeDef.props.name}`);
  }

  if (NodeDefs.isEntity(nodeDef)) {
    if (NodeDefs.isSingle(nodeDef)) {
      return (
        <NodeSingleEntityComponent
          nodeDef={nodeDef}
          parentNodeUuid={parentNodeUuid}
        />
      );
    }
    return (
      <NodeMultipleEntityPreviewComponent
        nodeDef={nodeDef}
        parentNodeUuid={parentNodeUuid}
      />
    );
  }

  if (NodeDefs.isSingle(nodeDef)) {
    return (
      <SingleAttributeComponentSwitch
        nodeDef={nodeDef}
        parentNodeUuid={parentNodeUuid}
      />
    );
  }

  if (nodeDef.type === NodeDefType.code) {
    return (
      <NodeCodeComponent nodeDef={nodeDef} parentNodeUuid={parentNodeUuid} />
    );
  }

  return (
    <MultipleAttributeComponentWrapper
      nodeDef={nodeDef}
      parentNodeUuid={parentNodeUuid}
    />
  );
};
