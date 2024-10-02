import { useCallback } from "react";

import { HView, SegmentedButtons } from "components";

import { useNodeComponentLocalState } from "../../useNodeComponentLocalState";
import { NodeComponentPropTypes } from "./nodeComponentPropTypes";

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
      updateNodeValue({ value: val === value ? null : val });
    },
    [updateNodeValue, value]
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

NodeBooleanComponent.propTypes = NodeComponentPropTypes;
