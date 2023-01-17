import { Text as RNText } from "react-native-paper";

export const Text = (props) => {
  const { style, textKey, variant } = props;

  return (
    <RNText style={style} variant={variant}>
      {textKey}
    </RNText>
  );
};
