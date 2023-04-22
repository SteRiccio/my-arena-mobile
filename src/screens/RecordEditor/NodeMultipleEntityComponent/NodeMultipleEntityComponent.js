import { NodeDefs } from "@openforis/arena-core";

import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { NodeEntityFormComponent } from "../NodeComponentSwitch/nodeTypes/NodeEntityFormComponent";
import { NodeMultipleEntityListComponent } from "./NodeMultipleEntityListComponent";

export const NodeMultipleEntityComponent = () => {
  const { entityDef, entityUuid } = DataEntrySelectors.useCurrentPageEntity();

  if (__DEV__) {
    console.log(
      "Rendering NodeMultipleEntityComponent for " + NodeDefs.getName(entityDef)
    );
  }

  if (entityUuid) {
    return (
      <NodeEntityFormComponent
        nodeDef={entityDef}
        parentNodeUuid={entityUuid}
      />
    );
  }

  return <NodeMultipleEntityListComponent />;
};
