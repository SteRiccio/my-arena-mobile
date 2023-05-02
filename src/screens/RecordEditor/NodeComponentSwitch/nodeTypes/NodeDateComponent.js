import { useCallback } from "react";
import { DateFormats, Dates, Objects } from "@openforis/arena-core";

import { DatePicker } from "../../../../components";
import { useNodeComponentLocalState } from "../../useNodeComponentLocalState";

export const NodeDateComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeTextComponent for ${nodeDef.props.name}`);
  }
  const { applicable, value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const onChange = useCallback((date) => {
    const dateNodeValue = Dates.format(date, DateFormats.dateStorage);
    updateNodeValue(dateNodeValue);
  }, []);

  const editable = !nodeDef.props.readOnly;

  const dateValue = Objects.isEmpty(value)
    ? null
    : Dates.parse(value, DateFormats.dateStorage);

  return (
    <DatePicker editable={editable} onChange={onChange} value={dateValue} />
  );
};
