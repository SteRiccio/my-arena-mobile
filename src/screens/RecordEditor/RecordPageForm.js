import { ScrollView } from "react-native";

import { NodeDefs } from "@openforis/arena-core";

import { DataEntrySelectors } from "../../state/dataEntry/selectors";
import { NodeEntityFormComponent } from "./NodeComponentSwitch/nodeTypes/NodeEntityFormComponent";
import { NodeMultipleEntityComponent } from "./NodeMultipleEntityComponent";

export const RecordPageForm = () => {
  const { nodeDef, node } = DataEntrySelectors.useCurrentPageNode();

  if (__DEV__) {
    console.log(`rendering RecordPageForm of ${nodeDef?.props?.name}`);
  }

  if (NodeDefs.isSingle(nodeDef)) {
    return (
      <ScrollView nestedScrollEnabled>
        <NodeEntityFormComponent
          nodeDef={nodeDef}
          parentNodeUuid={node?.uuid}
        />
      </ScrollView>
    );
  } else {
    return <NodeMultipleEntityComponent />;
  }
};
