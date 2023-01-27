import { NodeDefs } from "@openforis/arena-core";

import { NodeEntityFormComponent } from "./nodeTypes/NodeEntityFormComponent";
import { SingleAttributeComponentSwitch } from "./SingleAttributeComponentSwitch";

export const NodeComponentSwitch = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  console.log(`rendering NodeComponentSwitch for ${nodeDef.props.name}`);

  if (NodeDefs.isEntity(nodeDef)) {
    return <NodeEntityFormComponent nodeDef={nodeDef} nodeUuid={nodeUuid} />;
  }

  if (NodeDefs.isSingle(nodeDef) && NodeDefs.isAttribute(nodeDef)) {
    return (
      <SingleAttributeComponentSwitch
        nodeDef={nodeDef}
        parentNodeUuid={parentNodeUuid}
      />
    );
  }

  return (
    <Text
      textKey={`Multiple nodes not supported (${nodeDef.props.name} - ${nodeDef.type})`}
    />
  );
};
