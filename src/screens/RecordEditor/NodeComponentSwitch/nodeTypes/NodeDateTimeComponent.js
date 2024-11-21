import { useCallback } from "react";
import PropTypes from "prop-types";

import { Dates, Objects } from "@openforis/arena-core";

import { DateTimePicker } from "components";

import { useNodeComponentLocalState } from "../../useNodeComponentLocalState";
import { NodeComponentPropTypes } from "./nodeComponentPropTypes";

export const NodeDateTimeComponent = (props) => {
  const { formatDisplay, formatStorage, mode, nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeDateTimeComponent for ${nodeDef.props.name}`);
  }
  const { value, updateNodeValue } = useNodeComponentLocalState({ nodeUuid });

  const onChange = useCallback(
    (date) => {
      const dateNodeValue = Dates.format(date, formatStorage);
      updateNodeValue({ value: dateNodeValue });
    },
    [formatStorage, updateNodeValue]
  );

  const editable = !nodeDef.props.readOnly;

  const dateValue = Objects.isEmpty(value)
    ? null
    : Dates.parse(value, formatStorage, { keepTimeZone: false });

  return (
    <DateTimePicker
      editable={editable}
      format={formatDisplay}
      mode={mode}
      onChange={onChange}
      value={dateValue}
    />
  );
};

NodeDateTimeComponent.propTypes = {
  ...NodeComponentPropTypes,
  formatDisplay: PropTypes.string.isRequired,
  formatStorage: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["date", "time"]),
};
