import { useCallback } from "react";
import { DateFormats, Dates, Objects } from "@openforis/arena-core";

import { TimePicker } from "components";

import { useNodeComponentLocalState } from "../../useNodeComponentLocalState";

export const NodeTimeComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeTimeComponent for ${nodeDef.props.name}`);
  }
  const { value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const onChange = useCallback((date) => {
    const timeNodeValue = Dates.format(date, DateFormats.timeStorage);
    updateNodeValue(timeNodeValue);
  }, [updateNodeValue]);

  const editable = !nodeDef.props.readOnly;

  const dateValue = Objects.isEmpty(value)
    ? null
    : Dates.parse(value, DateFormats.timeStorage, false);

  return (
    <TimePicker editable={editable} onChange={onChange} value={dateValue} />
  );
};
