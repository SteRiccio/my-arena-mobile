import { useCallback } from "react";

import { HView, SegmentedButtons } from "components";

import { useNodeComponentLocalState } from "../../useNodeComponentLocalState";

const booleanValues = ["true", "false"];
const yesNoValueByBooleanValue = {
  true: "yes",
  false: "no",
};

export const NodeBooleanComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeBooleanComponent for ${nodeDef.props.name}`);
  }
  const { value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const onChange = useCallback(
    (val) => {
      updateNodeValue(val === value ? null : val);
    },
    [value]
  );

  const labelValue = nodeDef.props.labelValue ?? "trueFalse";

  const getLabelKey = useCallback(
    (booleanValue) =>
      labelValue === "trueFalse"
        ? booleanValue
        : yesNoValueByBooleanValue[booleanValue],
    [labelValue]
  );

  return (
    <HView style={{ width: "100%" }}>
      <SegmentedButtons
        buttons={booleanValues.map((val) => ({
          value: val,
          label: `common:${getLabelKey(val)}`,
        }))}
        onChange={onChange}
        value={value}
      />
    </HView>
  );
};
