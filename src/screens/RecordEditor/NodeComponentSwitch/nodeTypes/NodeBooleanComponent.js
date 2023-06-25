import { useCallback } from "react";

import { useTranslation } from "localization";
import { HView, SegmentedButtons } from "components";

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
    <HView style={{ width: "100%" }}>
      <SegmentedButtons
        buttons={booleanValues.map((val) => ({
          value: val,
          label: `common:${val}`,
        }))}
        onChange={onChange}
        value={value}
      />
    </HView>
  );
};
