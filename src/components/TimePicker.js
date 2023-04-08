import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateFormats, Dates } from "@openforis/arena-core";

import { HView } from "./HView";
import { IconButton } from "./IconButton";
import { TextInput } from "./TextInput";

export const TimePicker = (props) => {
  const { value, onChange: onChangeProp } = props;

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
        onPressIn={showTimePicker}
        style={{ width: 100 }}
        value={Dates.format(value, DateFormats.timeStorage)}
      />
      <IconButton icon="clock" onPress={showTimePicker} />
      {show && (
        <DateTimePicker
          is24Hour
          mode="time"
          onChange={onChange}
          value={value || new Date()}
        />
      )}
    </HView>
  );
};
