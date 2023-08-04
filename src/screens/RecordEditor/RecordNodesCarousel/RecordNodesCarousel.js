import PagerView from "react-native-pager-view";

import { NodeDefs } from "@openforis/arena-core";

import { DataEntrySelectors } from "state/dataEntry";

import { View } from "components";

import { NodeDefFormItem } from "../NodeDefFormItem";

export const RecordNodesCarousel = () => {
  const { entityDef, entityUuid } = DataEntrySelectors.useCurrentPageEntity();

  if (__DEV__) {
    console.log(
      `rendering RecordNodesCarousel of ${NodeDefs.getName(entityDef)}`
    );
  }

  const childrenDefs =
    DataEntrySelectors.useCurrentPageEntityRelevantChildDefs();

  return (
    <PagerView offscreenPageLimit={2} style={{ flex: 1 }}>
      {childrenDefs.map((childDef) => (
        <View key={childDef.uuid} style={{ margin: 10 }}>
          <NodeDefFormItem nodeDef={childDef} parentNodeUuid={entityUuid} />
        </View>
      ))}
    </PagerView>
  );
};
