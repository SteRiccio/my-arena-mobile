import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Button, HView, Text, VView } from "../../../components";
import { DataEntryActions } from "../../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { NodeEntityFormComponent } from "../NodeComponentSwitch/nodeTypes/NodeEntityFormComponent";
import { EntityDropdown } from "./EntityDropdown";

export const NodeMultipleEntityComponentOld = () => {
  const dispatch = useDispatch();
  const { entityDef, entity } = DataEntrySelectors.useCurrentPageEntity();
  const entityUuid = entity?.uuid;

  const [selectedEntityUuid, setSelectedEntityUuid] = useState(null);

  useEffect(() => {
    if (entityUuid && selectedEntityUuid) {
      // unmount form component
      setSelectedEntityUuid(null);
      // then mount it with new selected entity uuid
      setTimeout(() => setSelectedEntityUuid(entityUuid), 200);
    } else {
      setSelectedEntityUuid(entityUuid);
    }
  }, [entityUuid]);

  const nodeDefLabel = entityDef.props.name;

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
          nodeDef={entityDef}
          parentNodeUuid={selectedEntityUuid}
        />
      )}
    </VView>
  );
};
