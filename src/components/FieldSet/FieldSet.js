import { Text } from "../Text";
import { View } from "../View";

import styles from "./styles";
import { useTheme } from "react-native-paper";

export const FieldSet = (props) => {
  const { heading, children } = props;

  const theme = useTheme();

  return (
    <View style={[styles.fieldSet, { borderColor: theme.colors.onBackground }]}>
      <Text
        style={[
          styles.legend,
          { backgroundColor: theme.colors.inverseOnSurface },
        ]}
        textKey={heading}
      />
      {children}
    </View>
  );
};
