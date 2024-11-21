import React from "react";

import { DateFormats } from "@openforis/arena-core";

import { DateTimePicker } from "./DateTimePicker";

export const DatePicker = (props) => (
  <DateTimePicker
    {...props}
    format={DateFormats.dateDisplay}
    icon="calendar"
    mode="date"
    textInputStyle={{ width: 140 }}
  />
);

DatePicker.propTypes = DateTimePicker.propTypes;
