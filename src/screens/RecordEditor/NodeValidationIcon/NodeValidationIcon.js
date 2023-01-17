import { NodeDefs } from "@openforis/arena-core";
import { WarningIconButton } from "../../../components/WarningIconButton";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";

export const NodeValidationIcon = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  const { validation, validationChildrenCount } =
    DataEntrySelectors.useRecordNodePointerInfo({
      parentNodeUuid,
      nodeDefUuid: nodeDef?.uuid,
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
