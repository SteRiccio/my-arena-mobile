import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Button } from "./Button";
import { HView } from "./HView";
import { TextInput } from "./TextInput";

export const DatePicker = (props) => {
  const { value, onChange: onChangeProp } = props;

  const [show, setShow] = useState(false);

  const onChange = (_event, selectedDate) => {
    setShow(false);
    onChangeProp(selectedDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <HView>
      <TextInput
        editable={false}
        value={`${value?.toLocaleString()}`}
        onPressIn={showDatepicker}
      />
      <Button title="Show Date Picker" onPress={showDatepicker} />
      {show && (
        <DateTimePicker
          is24Hour
          mode="date"
          onChange={onChange}
          value={value || new Date()}
        />
      )}
    </HView>
  );
};
