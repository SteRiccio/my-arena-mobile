import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { Checkbox } from "../Checkbox";
import { RadioButton } from "../RadioButton";

export const ListItemIcon = (props) => {
  const { multiple, checked, editable, onItemSelect, item } = props;

  const onPress = useCallback(() => onItemSelect(item), [onItemSelect]);

  return multiple ? (
    <Checkbox checked={checked} disabled={!editable} onPress={onPress} />
  ) : (
    <RadioButton checked={checked} disabled={!editable} onPress={onPress} />
  );
};

ListItemIcon.propTypes = {
  multiple: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  editable: PropTypes.bool.isRequired,
  onItemSelect: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
};
