import { Button } from "components/Button";

import styles from "./styles";

export const NewNodeButton = (props) => {
  const { nodeDefLabel, onPress } = props;
  return (
    <Button
      icon="plus"
      onPress={onPress}
      style={styles.newButton}
      textKey="common:newItemWithParam"
      textParams={{ item: nodeDefLabel }}
    />
  );
};
