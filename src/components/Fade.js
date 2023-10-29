import { useEffect, useState } from "react";
import { Animated } from "react-native";

export const Fade = (props) => {
  const {
    duration,
    visible: visibleProp,
    style,
    children,
    ...otherProps
  } = props;

  const [state, setState] = useState({
    animatedValue: new Animated.Value(visibleProp ? 1 : 0),
    childrenVisible: visibleProp,
  });
  const { animatedValue, childrenVisible } = state;

  const setChildrenVisible = (value) =>
    setState((statePrev) => ({ ...statePrev, childrenVisible: value }));

  useEffect(() => {
    if (visibleProp) {
      setChildrenVisible(true);
    }
    Animated.timing(animatedValue, {
      toValue: visibleProp ? 1 : 0,
      duration,
      useNativeDriver: true,
    }).start(() => setChildrenVisible(visibleProp));
  }, [visibleProp]);

  const containerStyle = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1.1, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[containerStyle, style]} {...otherProps}>
      {childrenVisible ? children : null}
    </Animated.View>
  );
};

Fade.defaultProps = {
  duration: 500,
  visible: true,
};
