import { useCallback } from "react";
import PropTypes from "prop-types";

import { DateFormats, Dates, Objects } from "@openforis/arena-core";

import { DatePicker } from "components";
import { useNodeComponentLocalState } from "../../useNodeComponentLocalState";

export const NodeDateComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeDateComponent for ${nodeDef.props.name}`);
  }
  const { value, updateNodeValue } = useNodeComponentLocalState({
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

NodeDateComponent.propTypes = {
  nodeDef: PropTypes.object.isRequired,
  nodeUuid: PropTypes.string.isRequired,
};
