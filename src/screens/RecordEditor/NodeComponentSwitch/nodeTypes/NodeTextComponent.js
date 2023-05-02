import { NodeDefType, Objects } from "@openforis/arena-core";
import { useCallback } from "react";

import { TextInput } from "../../../../components";
import { useNodeComponentLocalState } from "../../useNodeComponentLocalState";

export const NodeTextComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeTextComponent for ${nodeDef.props.name}`);
  }
  const { applicable, value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
    updateDelay: 500,
  });

  const onChange = useCallback((text) => {
    updateNodeValue(text);
  }, []);

  const editable = !nodeDef.props.readOnly;
  const isNumeric = [NodeDefType.decimal, NodeDefType.integer].includes(
    nodeDef.type
  );
  const textValue = Objects.isEmpty(value) ? "" : String(value);

  return (
    <TextInput
      editable={editable}
      keyboardType={isNumeric ? "numeric" : undefined}
      style={[
        {
          alignSelf: "stretch",
          ...(applicable ? {} : { backgroundColor: "lightgray" }),
        },
      ]}
      onChange={onChange}
      value={textValue}
    />
  );
};
