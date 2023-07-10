import { useTheme } from "react-native-paper";

import { Text } from "../Text";
import { View } from "../View";

import styles from "./styles";

export const FieldSet = (props) => {
  const { heading, style, children } = props;

  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { borderColor: theme.colors.onBackground },
        style,
      ]}
    >
      <Text
        style={[
          styles.legend,
          { backgroundColor: theme.colors.surface },
        ]}
        textKey={heading}
      />
      {children}
    </View>
  );
};
