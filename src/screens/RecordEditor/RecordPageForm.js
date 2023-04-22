import { ScrollView } from "react-native";

import { NodeDefs } from "@openforis/arena-core";

import { DataEntrySelectors } from "../../state/dataEntry/selectors";
import { NodeEntityFormComponent } from "./NodeComponentSwitch/nodeTypes/NodeEntityFormComponent";
import { NodeMultipleEntityComponent } from "./NodeMultipleEntityComponent";

export const RecordPageForm = () => {
  const { entityDef, entityUuid } = DataEntrySelectors.useCurrentPageEntity();

  if (__DEV__) {
    console.log(`rendering RecordPageForm of ${NodeDefs.getName(entityDef)}`);
  }

  if (NodeDefs.isSingle(entityDef)) {
    return (
      <ScrollView
        nestedScrollEnabled
        style={{ flex: 1, marginBottom: 50 }}
        persistentScrollbar
      >
        <NodeEntityFormComponent
          nodeDef={entityDef}
          parentNodeUuid={entityUuid}
        />
      </ScrollView>
    );
  } else {
    return <NodeMultipleEntityComponent />;
  }
};
