import React from "react";
import { RadioButton } from "react-native-paper";
import { HView } from "../../../../../components";

export const NodeCodeSingleRadioComponent = (props) => {
  const { editable, items, onChange, value } = props;

  return (
    <RadioButton.Group onValueChange={onChange} value={value}>
      {items.map((item) => (
        <HView>
          <RadioButton.Item
            label={item.props.labels["en"]}
            disabled={!editable}
            value={item.uuid}
          />
        </HView>
      ))}
    </RadioButton.Group>
  );
};
