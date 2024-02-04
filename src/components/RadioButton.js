import { RadioButton as RNPRadioButton } from "react-native-paper";
import PropTypes from "prop-types";

export const RadioButton = (props) => {
  const { checked, disabled, key, label, onPress, style, value } = props;

  return (
    <RNPRadioButton.Item
      key={key}
      disabled={disabled}
      label={label}
      mode="android"
      onPress={onPress}
      status={checked ? "checked" : "unchecked"}
      style={[{ paddingVertical: 0, paddingHorizontal: 0 }, style]}
      value={value}
    />
  );
};

RadioButton.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
  value: PropTypes.string,
};
