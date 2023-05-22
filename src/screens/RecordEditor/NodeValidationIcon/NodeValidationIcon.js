import { NodeDefs, Validations } from "@openforis/arena-core";

import { Tooltip, WarningIconButton } from "components";
import { DataEntrySelectors } from "state";

export const NodeValidationIcon = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  const nodeDefUuid = nodeDef.uuid;

  const validation = DataEntrySelectors.useRecordNodePointerValidation({
    parentNodeUuid,
    nodeDefUuid,
  });
  const validationChildrenCount =
    DataEntrySelectors.useRecordNodePointerValidationChildrenCount({
      parentNodeUuid,
      nodeDefUuid,
    });

  if (!validation && !validationChildrenCount) return null;

  if (validationChildrenCount && !validationChildrenCount.valid) {
    const message = "required field";
    return (
      <Tooltip titleKey={message}>
        <WarningIconButton />
      </Tooltip>
    );
  }
  if (validation && !validation?.valid && NodeDefs.isSingle(nodeDef)) {
    const message = "error";
    return (
      <Tooltip titleKey={message}>
        <WarningIconButton />
      </Tooltip>
    );
  }

  return null;
};
