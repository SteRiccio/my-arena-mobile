import React from "react";
import ModalDropdown from "react-native-modal-dropdown";

export const Dropdown = (props) => {
  const { onSelect, options } = props;

  return <ModalDropdown onSelect={onSelect} options={options} />;
};
