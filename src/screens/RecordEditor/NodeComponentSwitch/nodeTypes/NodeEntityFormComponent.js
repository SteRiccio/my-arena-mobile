import { ScrollView } from "react-native";

import { NodeDefs } from "@openforis/arena-core";

import { NodeDefFormItem } from "../../NodeDefFormItem";
import { DataEntrySelectors } from "../../../../state/dataEntry/selectors";
import { VView } from "../../../../components";

export const NodeEntityFormComponent = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeDefEntityForm for ${NodeDefs.getName(nodeDef)}`);
  }
  const childrenDefs = DataEntrySelectors.useRecordEntityChildDefs({ nodeDef });

  return (
    <ScrollView
      nestedScrollEnabled
      style={{ flex: 1, marginBottom: 50 }}
      persistentScrollbar
    >
      <VView>
        {childrenDefs.map((childDef) => (
          <NodeDefFormItem
            key={childDef.uuid}
            nodeDef={childDef}
            parentNodeUuid={parentNodeUuid}
          />
        ))}
      </VView>
    </ScrollView>
  );
};
