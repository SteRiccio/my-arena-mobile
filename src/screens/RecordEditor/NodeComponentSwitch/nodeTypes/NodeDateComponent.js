import { useCallback } from "react";

import { DateFormats, Dates, Objects } from "@openforis/arena-core";

import { DatePicker, DeleteIconButton, HView } from "components";
import { useConfirm } from "state";

import { useNodeComponentLocalState } from "../../useNodeComponentLocalState";
import { NodeComponentPropTypes } from "./nodeComponentPropTypes";

export const NodeDateComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeDateComponent for ${nodeDef.props.name}`);
  }
  const confirm = useConfirm();
  const { value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const onChange = useCallback(
    (date) => {
      const dateNodeValue = Dates.format(date, DateFormats.dateStorage);
      updateNodeValue({ value: dateNodeValue });
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
    : Dates.parse(value, DateFormats.dateStorage);

  return (
    <HView>
      <DatePicker editable={editable} onChange={onChange} value={dateValue} />
      {dateValue && editable && <DeleteIconButton onPress={onClear} />}
    </HView>
  );
};

NodeDateComponent.propTypes = NodeComponentPropTypes;
