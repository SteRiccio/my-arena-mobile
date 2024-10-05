import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import PropTypes from "prop-types";

import { DateFormats, Dates } from "@openforis/arena-core";

import { HView } from "./HView";
import { IconButton } from "./IconButton";
import { TextInput } from "./TextInput";

export const TimePicker = (props) => {
  const { editable = true, onChange: onChangeProp, value } = props;

  const valueFormattedForStorage = Dates.format(value, DateFormats.timeStorage);
  const dateTimePickerValue = value ?? new Date();

  const [show, setShow] = useState(false);

  const onChange = (_event, selectedDate) => {
    setShow(false);
    onChangeProp(selectedDate);
  };

  const showTimePicker = () => {
    setShow(true);
  };

  return (
    <HView>
      <TextInput
        editable={false}
        nonEditableStyleVisible={false}
        onPressIn={showTimePicker}
        style={{ width: 100 }}
        value={valueFormattedForStorage}
      />
      <IconButton disabled={!editable} icon="clock" onPress={showTimePicker} />
      {show && (
        <DateTimePicker
          is24Hour
          mode="time"
          onChange={onChange}
          value={dateTimePickerValue}
        />
      )}
    </HView>
  );
};

TimePicker.propTypes = {
  editable: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.any,
};
