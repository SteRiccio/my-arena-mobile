import PropTypes from "prop-types";

import { View } from "./View";

export const Spacer = (props) => {
  const { fullWidth = true, width = undefined } = props;

  const style = width ? { width } : undefined;
  return <View fullWidth={fullWidth && !width} style={style} transparent />;
};

Spacer.propTypes = {
  fullWidth: PropTypes.bool,
  width: PropTypes.number,
};
