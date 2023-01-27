import { Objects } from "@openforis/arena-core";
import { useCallback } from "react";
import { TextInput } from "../../../../components";
import { useNodeComponentLocalState } from "../../nodeComponentLocalState";

export const NodeNumericComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  console.log(`rendering NodeNumericComponent for ${nodeDef.props.name}`);

  const { value, validation, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const onChange = useCallback((text) => {
    updateNodeValue(text);
  }, []);

  const editable = !nodeDef.props.readOnly;
  const textValue = Objects.isEmpty(value) ? null : String(value);

  return (
    <TextInput
      editable={editable}
      keyboardType="numeric"
      onChange={onChange}
      value={textValue}
    />
  );
};
