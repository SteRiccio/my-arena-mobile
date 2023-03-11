import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Button } from "./Button";
import { HView } from "./HView";
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
        value={`${value?.toLocaleString()}`}
        onPressIn={showTimePicker}
      />
      <Button title="Show Time Picker" onPress={showTimePicker} />
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
