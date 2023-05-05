import { View } from "react-native";

import { Text } from "../Text";

import styles from "./styles";

export const FieldSet = (props) => {
  const { heading, children } = props;

  return (
    <View style={styles.fieldSet}>
      <Text style={styles.legend} textKey={heading} />
      {children}
    </View>
  );
};
