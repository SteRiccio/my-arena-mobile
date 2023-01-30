import { useCallback } from "react";

import { TextInput } from "../../../../components";
import { useNodeComponentLocalState } from "../../nodeComponentLocalState";

export const NodeTextComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  console.log(`rendering NodeTextComponent for ${nodeDef.props.name}`);

  const { applicable, value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const onChange = useCallback((text) => {
    updateNodeValue(text);
  }, []);

  const editable = !nodeDef.props.readOnly;

  return (
    <TextInput
      editable={editable}
      style={[
        {
          alignSelf: "stretch",
          ...(applicable ? {} : { backgroundColor: "lightgray" }),
        },
      ]}
      onChange={onChange}
      value={value}
    />
  );
};
