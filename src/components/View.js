import React, { useMemo } from "react";
import { StyleSheet, View as RNView } from "react-native";
import { useTheme } from "react-native-paper";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  fullWidth: {
    flex: 1,
    width: "100%",
  },
});

export const View = (props) => {
  const {
    children,
    fullWidth = false,
    style: styleProp,
    transparent = false,
    ...otherProps
  } = props;

  const theme = useTheme();

  const backgroundColor = useMemo(
    () => (transparent ? "transparent" : theme.colors.background),
    [theme, transparent]
  );

  const style = useMemo(() => {
    const parts = [{ backgroundColor }];
    if (fullWidth) parts.push(styles.fullWidth);
    if (styleProp) parts.push(styleProp);
    return StyleSheet.compose(parts);
  }, [backgroundColor, fullWidth, styleProp]);

  return (
    <RNView style={style} {...otherProps}>
      {children}
    </RNView>
  );
};

View.propTypes = {
  children: PropTypes.node,
  fullWidth: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  transparent: PropTypes.bool,
};
