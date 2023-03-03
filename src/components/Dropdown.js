import React, { useCallback, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

export const Dropdown = (props) => {
  const { items, onChange, value } = props;

  const [open, setOpen] = useState(false);

  const setValue = useCallback(
    async (callback) => {
      const val = callback(value);
      await onChange(val);
    },
    [onChange, value]
  );

  return (
    <DropDownPicker
      items={items}
      open={open}
      setOpen={setOpen}
      value={value}
      setValue={setValue}
    />
  );
};
