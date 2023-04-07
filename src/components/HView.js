import { View } from "react-native";

export const HView = (props) => {
  const { children, style, ...otherProps } = props;

  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
          gap: 4,
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </View>
  );
};

HView.defaultProps = {
  style: {},
};
