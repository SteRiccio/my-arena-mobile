import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "react-native-paper";
import RNPDropdown from "react-native-paper-dropdown";

import { UUIDs } from "@openforis/arena-core";

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

  const theme = useTheme();
  const { t } = useTranslation();

  const label = showLabel ? t(labelProp) : "";

  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(undefined);

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

  useEffect(() => {
    setKey(UUIDs.v4());
  }, [onChange]);

  return (
    <RNPDropdown
      disabled={disabled}
      key={key}
      label={label}
      list={options}
      mode="outlined"
      onDismiss={() => setOpen(false)}
      setValue={setValue}
      showDropDown={() => setOpen(true)}
      dropDownItemStyle={{ backgroundColor: theme.colors.surfaceVariant }}
      dropDownItemTextStyle={{ color: theme.colors.onSurfaceVariant }}
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
