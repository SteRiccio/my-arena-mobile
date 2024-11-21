import React from "react";

import { DateFormats } from "@openforis/arena-core";

import { DateTimePicker } from "./DateTimePicker";

export const TimePicker = (props) => (
  <DateTimePicker
    {...props}
    format={DateFormats.timeStorage}
    icon="clock"
    mode="time"
    textInputStyle={{ width: 100 }}
  />
);

TimePicker.propTypes = DateTimePicker.propTypes;
