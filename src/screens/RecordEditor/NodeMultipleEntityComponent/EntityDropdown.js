import { Objects } from "@openforis/arena-core";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { Dropdown } from "../../../components";
import { DataEntryActions } from "../../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";

const defaultIfEmpty = (defaultValue) => (text) =>
  Objects.isEmpty(text) ? defaultValue : text;

export const EntityDropdown = () => {
  const dispatch = useDispatch();
  const { nodeDef, parentNode, node } = DataEntrySelectors.useCurrentPageNode();

  const selectedEntityUuid = node?.uuid;

  const entitiesUuidsAndKeyValues =
    DataEntrySelectors.useRecordEntitiesUuidsAndKeyValues({
      parentNodeUuid: parentNode.uuid,
      nodeDefUuid: nodeDef.uuid,
    });

  const onChange = useCallback((entityUuid) => {
    dispatch(
      DataEntryActions.selectCurrentPageNode({
        nodeDefUuid: nodeDef.uuid,
        nodeUuid: entityUuid,
      })
    );
  }, []);

  const dropdownItems = entitiesUuidsAndKeyValues.map(
    ({ uuid, keyValues }) => ({
      value: uuid,
      label: defaultIfEmpty("--- EMPTY ---")(keyValues.join(" - ")),
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
