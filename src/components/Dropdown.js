import React, { useCallback, useMemo } from "react";
import { Dropdown as RNPDropdown } from "react-native-paper-dropdown";
import PropTypes from "prop-types";

import { useTranslation } from "localization";

export const Dropdown = (props) => {
  const {
    disabled,
    itemKeyExtractor = (item) => item.value,
    itemLabelExtractor = (item) => item.label,
    label: labelProp = "common:selectAnItem",
    items,
    onChange,
    showLabel = true,
    value,
  } = props;

  const { t } = useTranslation();

  const label = showLabel ? t(labelProp) : "";

  const itemToOption = useCallback(
    (item) => ({
      value: itemKeyExtractor(item),
      label: t(itemLabelExtractor(item)),
    }),
    [itemKeyExtractor, itemLabelExtractor]
  );

  const options = useMemo(() => items.map(itemToOption), [itemToOption, items]);

  const setValue = useCallback(
    async (val) => {
      if (disabled) return;
      await onChange(val);
    },
    [disabled, onChange]
  );

  return (
    <RNPDropdown
      disabled={disabled}
      hideMenuHeader
      label={label}
      options={options}
      mode="outlined"
      onSelect={setValue}
      value={value}
    />
  );
};

Dropdown.propTypes = {
  disabled: PropTypes.bool,
  itemKeyExtractor: PropTypes.func,
  itemLabelExtractor: PropTypes.func,
  label: PropTypes.string,
  items: PropTypes.array,
  onChange: PropTypes.func,
  showLabel: PropTypes.bool,
  value: PropTypes.any,
};
