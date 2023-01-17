import { View } from "react-native";

export const HView = (props) => {
  const { children, ...otherProps } = props;

  return (
    <View style={[{ flexDirection: "row" }]} {...otherProps}>
      {children}
    </View>
  );
};
