import React, { useCallback, useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import PropTypes from "prop-types";

import { Dates } from "@openforis/arena-core";

import { HView } from "./HView";
import { IconButton } from "./IconButton";
import { TextInput } from "./TextInput";

export const DateTimePicker = (props) => {
  const {
    format,
    icon,
    mode,
    onChange: onChangeProp,
    textInputStyle,
    value,
  } = props;

  const [show, setShow] = useState(false);

  const onChange = useCallback(
    (_event, selectedDate) => {
      setShow(false);
      onChangeProp(selectedDate);
    },
    [onChangeProp]
  );

  const showDatePicker = useCallback(() => {
    setShow(true);
  }, []);

  return (
    <HView>
      <TextInput
        editable={false}
        nonEditableStyleVisible={false}
        onPressIn={showDatePicker}
        style={textInputStyle}
        value={Dates.format(value, format)}
      />
      <IconButton icon={icon} onPress={showDatePicker} />
      {show && (
        <RNDateTimePicker
          mode={mode}
          onChange={onChange}
          value={value || new Date()}
        />
      )}
    </HView>
  );
};

DateTimePicker.propTypes = {
  format: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["date", "time"]),
  onChange: PropTypes.func.isRequired,
  textInputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.any,
};
