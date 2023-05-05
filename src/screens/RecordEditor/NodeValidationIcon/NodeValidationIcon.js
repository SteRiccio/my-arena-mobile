import { NodeDefs } from "@openforis/arena-core";

import { WarningIconButton } from "components";
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
    return <WarningIconButton />;
  }
  if (validation && !validation?.valid && NodeDefs.isSingle(nodeDef)) {
    return <WarningIconButton />;
  }

  return null;
};
