import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Button, HView, Text, VView } from "../../../components";
import { DataEntryActions } from "../../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { NodeEntityFormComponent } from "../NodeComponentSwitch/nodeTypes/NodeEntityFormComponent";
import { EntityDropdown } from "./EntityDropdown";

export const NodeMultipleEntityComponent = () => {
  const dispatch = useDispatch();
  const { nodeDef, node } = DataEntrySelectors.useCurrentPageNode();
  const nodeUuid = node?.uuid;

  const [selectedEntityUuid, setSelectedEntityUuid] = useState(null);

  useEffect(() => {
    if (nodeUuid && selectedEntityUuid) {
      // unmount form component
      setSelectedEntityUuid(null);
      // then mount it with new selected entity uuid
      setTimeout(() => setSelectedEntityUuid(nodeUuid), 200);
    } else {
      setSelectedEntityUuid(nodeUuid);
    }
  }, [nodeUuid]);

  const nodeDefLabel = nodeDef.props.name;

  const onNewPress = () => {
    dispatch(DataEntryActions.addNewEntity);
  };

  return (
    <VView>
      <HView>
        <Text textKey={`Current ${nodeDefLabel}:`} />
        <EntityDropdown />
      </HView>
      <Button icon="plus" onPress={onNewPress}>
        New {nodeDefLabel}
      </Button>
      {selectedEntityUuid && (
        <NodeEntityFormComponent
          nodeDef={nodeDef}
          parentNodeUuid={selectedEntityUuid}
        />
      )}
    </VView>
  );
};
