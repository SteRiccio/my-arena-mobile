import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { Strings } from "@openforis/arena-core";

import { Dropdown } from "../../../components";
import { DataEntryActions } from "../../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";

export const EntityDropdown = () => {
  const dispatch = useDispatch();
  const { entityDef, parentEntity, entity } =
    DataEntrySelectors.useCurrentPageEntity();

  const selectedEntityUuid = entity?.uuid;

  const entitiesUuidsAndKeyValues =
    DataEntrySelectors.useRecordEntitiesUuidsAndKeyValues({
      parentNodeUuid: parentEntity.uuid,
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
