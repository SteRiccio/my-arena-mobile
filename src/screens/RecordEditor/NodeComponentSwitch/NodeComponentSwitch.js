import { NodeDefType, NodeDefs } from "@openforis/arena-core";

import { NodeCodeComponent } from "./nodeTypes/NodeCodeComponent";
import { NodeMultipleEntityPreviewComponent } from "./nodeTypes/NodeMultipleEntityPreviewComponent";
import { NodeSingleEntityComponent } from "./nodeTypes/NodeSingleEntityComponent";

import { SingleAttributeComponentSwitch } from "./SingleAttributeComponentSwitch";
import { MultipleAttributeComponentWrapper } from "./MultipleAttributeComponentWrapper";
import { DataEntrySelectors } from "state/dataEntry";
import { RecordEditViewMode } from "model/RecordEditViewMode";
import { NodeMultipleEntityComponent } from "../NodeMultipleEntityComponent";

export const NodeComponentSwitch = (props) => {
  const { nodeDef, parentNodeUuid, onFocus } = props;

  if (__DEV__) {
    console.log(`rendering NodeComponentSwitch for ${nodeDef.props.name}`);
  }

  const viewMode = DataEntrySelectors.useRecordEditViewMode();

  if (NodeDefs.isEntity(nodeDef)) {
    if (NodeDefs.isSingle(nodeDef)) {
      return (
        <NodeSingleEntityComponent
          nodeDef={nodeDef}
          parentNodeUuid={parentNodeUuid}
        />
      );
    }
    if (viewMode === RecordEditViewMode.oneNode) {
      return (
        <NodeMultipleEntityComponent
          entityDef={nodeDef}
          parentEntityUuid={parentNodeUuid}
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
        onFocus={onFocus}
      />
    );
  }

  if (nodeDef.type === NodeDefType.code) {
    return (
      <NodeCodeComponent
        nodeDef={nodeDef}
        parentNodeUuid={parentNodeUuid}
        onFocus={onFocus}
      />
    );
  }

  return (
    <MultipleAttributeComponentWrapper
      nodeDef={nodeDef}
      parentNodeUuid={parentNodeUuid}
    />
  );
};
