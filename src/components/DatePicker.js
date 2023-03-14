import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateFormats, Dates } from "@openforis/arena-core";

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

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <HView>
      <TextInput
        editable={false}
        value={Dates.format(value, DateFormats.dateDisplay)}
        onPressIn={showDatePicker}
      />
      <Button
        icon="calendar"
        title="Show Date Picker"
        onPress={showDatePicker}
      />
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
