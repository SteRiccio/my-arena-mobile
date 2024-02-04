import React from "react";

import { HView, RadioButton, RadioButtonGroup } from "components";
import styles from "./styles";

export const NodeCodeSingleRadioComponent = (props) => {
  const { editable, itemLabelFunction, items, onChange, value } = props;

  return (
    <RadioButtonGroup onValueChange={onChange} value={value}>
      <HView style={styles.container}>
        {items.map((item) => (
          <RadioButton
            key={item.uuid}
            disabled={!editable}
            label={itemLabelFunction(item)}
            style={styles.item}
            value={item.uuid}
          />
        ))}
      </HView>
    </RadioButtonGroup>
  );
};
