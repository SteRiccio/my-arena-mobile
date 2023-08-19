import { Text } from "components";

import styles from "./styles";

export const NodeCodeReadOnlyValue = (props) => {
  const { itemLabelFunction, selectedItems } = props;

  const itemLabels = selectedItems?.map(itemLabelFunction).join("; ");

  return (
    <Text variant="bodyLarge" style={styles.item}>
      {itemLabels}
    </Text>
  );
};
