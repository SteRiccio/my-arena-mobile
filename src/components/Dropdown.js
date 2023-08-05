import React, { useCallback, useMemo, useState } from "react";
import RNPDropdown from "react-native-paper-dropdown";

import { useTranslation } from "localization";

export const Dropdown = (props) => {
  const {
    disabled,
    itemKeyExtractor,
    itemLabelExtractor,
    items,
    label: labelProp,
    onChange,
    showLabel,
    value,
  } = props;

  const { t } = useTranslation();

  const label = showLabel ? t(labelProp) : "";

  const [open, setOpen] = useState(false);

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
    [disabled, onChange, value]
  );

  return (
    <RNPDropdown
      disabled={disabled}
      label={label}
      list={options}
      mode="outlined"
      onDismiss={() => setOpen(false)}
      setValue={setValue}
      showDropDown={() => setOpen(true)}
      value={value}
      visible={open}
    />
  );
};

Dropdown.defaultProps = {
  itemKeyExtractor: (item) => item.value,
  itemLabelExtractor: (item) => item.label,
  label: "common:selectAnItem",
  showLabel: true,
};
