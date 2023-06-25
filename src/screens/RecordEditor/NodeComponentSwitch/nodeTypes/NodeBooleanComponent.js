import { useCallback } from "react";
import { View } from "react-native";
import { SegmentedButtons } from "react-native-paper";

import { useTranslation } from "localization";
import { useNodeComponentLocalState } from "../../useNodeComponentLocalState";

const booleanValues = ["true", "false"];

export const NodeBooleanComponent = (props) => {
  const { nodeDef, nodeUuid } = props;
  const { t } = useTranslation();

  if (__DEV__) {
    console.log(`rendering NodeBooleanComponent for ${nodeDef.props.name}`);
  }
  const { value, validation, updateNodeValue } = useNodeComponentLocalState({
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
          label: t(`common:${val}`),
        }))}
      />
    </View>
  );
};
