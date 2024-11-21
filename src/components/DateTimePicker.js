import React, { useCallback, useState } from "react";
import { Pressable } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { TextInput as RNPTextInput } from "react-native-paper";
import PropTypes from "prop-types";

import { Dates } from "@openforis/arena-core";

import { useConfirm } from "state/confirm";

import { HView } from "./HView";
import { IconButton } from "./IconButton";
import { TextInput } from "./TextInput";

export const DateTimePicker = (props) => {
  const {
    editable = true,
    format,
    mode,
    onChange: onChangeProp,
    value,
  } = props;

  const confirm = useConfirm();

  const [show, setShow] = useState(false);

  const showDatePicker = useCallback(() => {
    setShow(true);
  }, []);

  const onDatePickerChange = useCallback(
    (event, selectedDate) => {
      setShow(false);
      if (event.type === "set") {
        onChangeProp(selectedDate);
      }
    },
    [onChangeProp]
  );

  const onClear = useCallback(
    async (event) => {
      event.stopPropagation();
      if (await confirm({ messageKey: "common:confirmClearSelectedValue" })) {
        setShow(false);
        onChangeProp(null);
      }
    },
    [confirm, onChangeProp]
  );

  const icon = mode === "date" ? "calendar" : "clock";
  const textInputStyle = { width: mode === "date" ? 170 : 120 };

  return (
    <HView>
      <Pressable onPress={editable ? showDatePicker : undefined}>
        <TextInput
          editable={false}
          nonEditableStyleVisible={false}
          onPressIn={showDatePicker}
          right={
            editable && value ? (
              <RNPTextInput.Icon icon="close" onPress={onClear} />
            ) : undefined
          }
          style={textInputStyle}
          value={Dates.format(value, format)}
        />
      </Pressable>
      <IconButton disabled={!editable} icon={icon} onPress={showDatePicker} />
      {show && (
        <RNDateTimePicker
          mode={mode}
          onChange={onDatePickerChange}
          value={value || new Date()}
        />
      )}
    </HView>
  );
};

DateTimePicker.propTypes = {
  editable: PropTypes.bool,
  format: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["date", "time"]),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};
