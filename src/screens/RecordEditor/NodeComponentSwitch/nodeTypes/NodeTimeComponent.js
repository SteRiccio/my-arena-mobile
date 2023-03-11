import { useCallback } from "react";
import { Dates, Objects } from "@openforis/arena-core";

import { useNodeComponentLocalState } from "../../nodeComponentLocalState";
import { TimePicker } from "../../../../components";

export const NodeTimeComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeTextComponent for ${nodeDef.props.name}`);
  }
  const { applicable, value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const onChange = useCallback((date) => {
    const timeNodeValue = Dates.convertDate({
      dateStr: date.toISOString(),
      formatFrom: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      formatTo: "HH:mm",
    });
    updateNodeValue(timeNodeValue);
  }, []);

  const editable = !nodeDef.props.readOnly;

  const dateValue = Objects.isEmpty(value) ? null : new Date(value);

  return (
    <TimePicker editable={editable} onChange={onChange} value={dateValue} />
  );
};
