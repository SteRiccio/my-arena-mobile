import { useCallback } from "react";
import { TextInput } from "../../../../components";
import { useNodeRendererLocalState } from "../../nodeLocalState";

export const NodeNumericComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  const { value, validation, updateNodeValue } = useNodeRendererLocalState({
    nodeUuid,
  });

  const onChange = useCallback((text) => {
    updateNodeValue(text);
  }, []);

  return <TextInput keyboardType="numeric" onChange={onChange} value={value} />;
};
