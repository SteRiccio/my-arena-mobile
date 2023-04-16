import { NodeDefs } from "@openforis/arena-core";

import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { NodeEntityFormComponent } from "../NodeComponentSwitch/nodeTypes/NodeEntityFormComponent";
import { NodeMultipleEntityListComponent } from "./NodeMultipleEntityListComponent";

export const NodeMultipleEntityComponent = () => {
  const { entityDef, entity } = DataEntrySelectors.useCurrentPageEntity();

  if (__DEV__) {
    console.log(
      "Rendering NodeMultipleEntityComponent for " + NodeDefs.getName(entityDef)
    );
  }

  if (entity) {
    return (
      <NodeEntityFormComponent
        nodeDef={entityDef}
        parentNodeUuid={entity.uuid}
      />
    );
  }

  return <NodeMultipleEntityListComponent />;
};
