import { NodeDefs } from "@openforis/arena-core";

import { DataEntrySelectors } from "state";
import { NodeEntityFormComponent } from "../NodeComponentSwitch/nodeTypes/NodeEntityFormComponent";
import { NodeMultipleEntityComponent } from "../NodeMultipleEntityComponent";
import { View } from "components";

import styles from "./styles";

export const RecordPageForm = () => {
  const { entityDef, entityUuid, parentEntityUuid } =
    DataEntrySelectors.useCurrentPageEntity();

  if (__DEV__) {
    console.log(`rendering RecordPageForm of ${NodeDefs.getName(entityDef)}`);
  }

  const internalContainer =
    NodeDefs.isRoot(entityDef) || NodeDefs.isSingle(entityDef) ? (
      <NodeEntityFormComponent
        nodeDef={entityDef}
        parentNodeUuid={entityUuid}
      />
    ) : (
      <NodeMultipleEntityComponent
        entityDef={entityDef}
        parentEntityUuid={parentEntityUuid}
        entityUuid={entityUuid}
      />
    );
  return <View style={styles.container}>{internalContainer}</View>;
};
