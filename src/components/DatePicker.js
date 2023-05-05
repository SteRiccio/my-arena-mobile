import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { DateFormats, Dates } from "@openforis/arena-core";

import { HView } from "./HView";
import { IconButton } from "./IconButton";
import { TextInput } from "./TextInput";

export const DatePicker = (props) => {
  const { value, onChange: onChangeProp } = props;

  const [show, setShow] = useState(false);

  const onChange = (_event, selectedDate) => {
    setShow(false);
    onChangeProp(selectedDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <HView>
      <TextInput
        editable={false}
        onPressIn={showDatePicker}
        style={{ width: 140 }}
        value={Dates.format(value, DateFormats.dateDisplay)}
      />
      <IconButton icon="calendar" onPress={showDatePicker} />
      {show && (
        <DateTimePicker
          mode="date"
          onChange={onChange}
          value={value || new Date()}
        />
      )}
    </HView>
  );
};
