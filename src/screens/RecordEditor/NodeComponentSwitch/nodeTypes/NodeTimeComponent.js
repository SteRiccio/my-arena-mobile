import { useCallback } from "react";

import { DateFormats, Dates, Objects } from "@openforis/arena-core";

import { DeleteIconButton, HView, TimePicker } from "components";
import { useConfirm } from "state";

import { useNodeComponentLocalState } from "../../useNodeComponentLocalState";
import { NodeComponentPropTypes } from "./nodeComponentPropTypes";

export const NodeTimeComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeTimeComponent for ${nodeDef.props.name}`);
  }
  const confirm = useConfirm();
  const { value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const onChange = useCallback(
    (date) => {
      const timeNodeValue = Dates.format(date, DateFormats.timeStorage);
      updateNodeValue({ value: timeNodeValue });
    },
    [updateNodeValue]
  );

  const onClear = useCallback(async () => {
    if (await confirm({ messageKey: "dataEntry:confirmDeleteValue.message" })) {
      updateNodeValue({ value: null });
    }
  }, [confirm, updateNodeValue]);

  const editable = !nodeDef.props.readOnly;

  const dateValue = Objects.isEmpty(value)
    ? null
    : Dates.parse(value, DateFormats.timeStorage, { keepTimeZone: false });

  return (
    <HView>
      <TimePicker editable={editable} onChange={onChange} value={dateValue} />
      {dateValue && editable && <DeleteIconButton onPress={onClear} />}
    </HView>
  );
};

NodeTimeComponent.propTypes = NodeComponentPropTypes;
