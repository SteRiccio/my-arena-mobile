import React from "react";
import { RadioButton } from "react-native-paper";

import { HView } from "../../../../../components";
import styles from "./styles";

export const NodeCodeSingleRadioComponent = (props) => {
  const { editable, itemLabelFunction, items, onChange, value } = props;

  return (
    <RadioButton.Group onValueChange={onChange} value={value}>
      <HView style={styles.container}>
        {items.map((item) => (
          <RadioButton.Item
            key={item.uuid}
            label={itemLabelFunction(item)}
            disabled={!editable}
            value={item.uuid}
          />
        ))}
      </HView>
    </RadioButton.Group>
  );
};
