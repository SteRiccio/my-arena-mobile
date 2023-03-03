import { useCallback } from "react";
import { Dates, Objects } from "@openforis/arena-core";

import { DatePicker } from "../../../../components";
import { useNodeComponentLocalState } from "../../nodeComponentLocalState";

export const NodeDateComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeTextComponent for ${nodeDef.props.name}`);
  }
  const { applicable, value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const onChange = useCallback((date) => {
    const dateNodeValue = Dates.convertDate({
      dateStr: date.toISOString(),
      formatFrom: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      formatTo: "yyyy-MM-dd",
    });
    updateNodeValue(dateNodeValue);
  }, []);

  const editable = !nodeDef.props.readOnly;

  const dateValue = Objects.isEmpty(value) ? null : new Date(value);
  console.log("---date", dateValue);

  return (
    <DatePicker editable={editable} onChange={onChange} value={dateValue} />
  );
};
