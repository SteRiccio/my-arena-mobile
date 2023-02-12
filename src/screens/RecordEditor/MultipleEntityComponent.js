import { NodeDefs } from "@openforis/arena-core";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Dropdown } from "../../components";
import { DataEntryActions } from "../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../state/dataEntry/selectors";
import { NodeComponentSwitch } from "./NodeComponentSwitch/NodeComponentSwitch";

export const MultipleEntityComponent = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  const dispatch = useDispatch();
  const cycle = DataEntrySelectors.useRecordCycle();
  const pageUuid = NodeDefs.getLayoutProps(cycle).pageUuid;
  const selectedEntityUuid = DataEntrySelectors.useRecordSelectedEntityUuid({
    pageUuid,
  });

  const entitiesUuidsAndKeyValues =
    DataEntrySelectors.useRecordEntitiesUuidsAndKeyValues({
      parentNodeUuid,
      nodeDefUuid: nodeDef.uuid,
    });

  const onDropdownSelect = useCallback((selectedIndex) => {
    const entityUuid = entitiesUuidsAndKeyValues[selectedIndex]?.uuid;
    dispatch(DataEntryActions.selectEntityInPage({ pageUuid, entityUuid }));
  }, []);

  const dropdownOptions = entitiesUuidsAndKeyValues.map(({ keyValues }) =>
    keyValues.join(" - ")
  );
  const selectedEntityIndex = entitiesUuidsAndKeyValues.findIndex(
    ({ entityUuid }) => entityUuid === selectedEntityUuid
  );

  const selectedEntityOptionLabel = dropdownOptions[selectedEntityIndex];

  return (
    <>
      <Dropdown
        defaultValue={selectedEntityOptionLabel}
        options={dropdownOptions}
        onSelect={onDropdownSelect}
      />
      {selectedEntityUuid && (
        <NodeComponentSwitch
          nodeDef={nodeDef}
          parentNodeUuid={selectedEntityUuid}
        />
      )}
    </>
  );
};
