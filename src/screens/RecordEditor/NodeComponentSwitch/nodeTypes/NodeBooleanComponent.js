import { useCallback } from "react";
import { View } from "react-native";
import { SegmentedButtons } from "react-native-paper";

import { useNodeRendererLocalState } from "../../nodeLocalState";

const booleanValues = [true, false];

export const NodeBooleanComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  const { value, validation, updateNodeValue } = useNodeRendererLocalState({
    nodeUuid,
  });

  const onChange = useCallback(
    (val) => {
      updateNodeValue(val === value ? null : val);
    },
    [value]
  );

  return (
    <View style={[{ flexDirection: "row", width: "100%" }]}>
      <SegmentedButtons
        value={value}
        onValueChange={onChange}
        buttons={booleanValues.map((val) => ({
          value: val,
          label: String(val),
        }))}
      />
    </View>
  );
};
