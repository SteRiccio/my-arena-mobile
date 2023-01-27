import { useCallback } from "react";

import { TextInput } from "../../../../components";
import { useNodeComponentLocalState } from "../../nodeComponentLocalState";

export const NodeTextComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  console.log(`rendering NodeTextComponent for ${nodeDef.props.name}`);

  const { value, validation, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const onChange = useCallback((text) => {
    updateNodeValue(text);
  }, []);

  const editable = !nodeDef.props.readOnly;

  return (
    <TextInput
      editable={editable}
      style={[{ alignSelf: "stretch" }]}
      onChange={onChange}
      value={value}
    />
  );
};
