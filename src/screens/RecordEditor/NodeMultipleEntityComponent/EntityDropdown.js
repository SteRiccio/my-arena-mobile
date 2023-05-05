import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { Strings } from "@openforis/arena-core";

import { Dropdown } from "components";
import { DataEntryActions, DataEntrySelectors } from "state";

export const EntityDropdown = () => {
  const dispatch = useDispatch();
  const { entityDef, parentEntityUuid, entityUuid } =
    DataEntrySelectors.useCurrentPageEntity();

  const selectedEntityUuid = entityUuid;

  const entitiesUuidsAndKeyValues =
    DataEntrySelectors.useRecordEntitiesUuidsAndKeyValues({
      parentNodeUuid: parentEntityUuid,
      nodeDefUuid: entityDef.uuid,
    });

  const onChange = useCallback((entityUuid) => {
    dispatch(
      DataEntryActions.selectCurrentPageEntity({
        entityDefUuid: entityDef.uuid,
        entityUuid,
      })
    );
  }, []);

  const dropdownItems = entitiesUuidsAndKeyValues.map(
    ({ uuid, keyValues }) => ({
      value: uuid,
      label: Strings.defaultIfEmpty("--- EMPTY ---")(keyValues.join(" - ")),
    })
  );

  return (
    <Dropdown
      items={dropdownItems}
      onChange={onChange}
      value={selectedEntityUuid}
    />
  );
};
