import { NodeDefs } from "@openforis/arena-core";

import { DataEntrySelectors } from "state";
import { NodeEntityFormComponent } from "./NodeComponentSwitch/nodeTypes/NodeEntityFormComponent";
import { NodeMultipleEntityComponent } from "./NodeMultipleEntityComponent";

export const RecordPageForm = () => {
  const { entityDef, entityUuid } = DataEntrySelectors.useCurrentPageEntity();

  if (__DEV__) {
    console.log(`rendering RecordPageForm of ${NodeDefs.getName(entityDef)}`);
  }

  if (NodeDefs.isRoot(entityDef) || NodeDefs.isSingle(entityDef)) {
    return (
      <NodeEntityFormComponent
        nodeDef={entityDef}
        parentNodeUuid={entityUuid}
      />
    );
  } else {
    return <NodeMultipleEntityComponent />;
  }
};
