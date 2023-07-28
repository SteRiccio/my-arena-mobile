import { NodeDefType, NodeDefs, Objects } from "@openforis/arena-core";
import { useCallback } from "react";

import { TextInput } from "../../../../components";
import { useNodeComponentLocalState } from "../../useNodeComponentLocalState";

export const NodeTextComponent = (props) => {
  const { nodeDef, nodeUuid, style } = props;

  if (__DEV__) {
    console.log(`rendering NodeTextComponent for ${nodeDef.props.name}`);
  }

  const isNumeric = [NodeDefType.decimal, NodeDefType.integer].includes(
    nodeDef.type
  );

  const editable = !NodeDefs.isReadOnly(nodeDef);

  const nodeValueToUiValue = useCallback(
    (value) => (Objects.isEmpty(value) ? "" : String(value)),
    []
  );

  const uiValueToNodeValue = useCallback(
    (uiValue) => {
      if (Objects.isEmpty(uiValue)) return null;
      if (isNumeric) return Number(uiValue);
      return uiValue;
    },
    [isNumeric]
  );

  const { applicable, invalidValue, uiValue, updateNodeValue } =
    useNodeComponentLocalState({
      nodeUuid,
      updateDelay: 500,
      nodeValueToUiValue,
      uiValueToNodeValue,
    });

  return (
    <TextInput
      editable={editable}
      error={invalidValue}
      keyboardType={isNumeric ? "numeric" : undefined}
      style={[
        {
          alignSelf: "stretch",
          ...(applicable ? {} : { backgroundColor: "lightgray" }),
        },
        style,
      ]}
      onChange={updateNodeValue}
      value={uiValue}
    />
  );
};
