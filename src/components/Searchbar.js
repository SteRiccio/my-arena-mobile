import React from "react";
import { Searchbar as RNPSearchbar } from "react-native-paper";

import { useTranslation } from "localization";

export const Searchbar = (props) => {
  const {
    placeholder: placeholderProp = "common:search",
    onChange,
    value,
  } = props;

  const { t } = useTranslation();

  return (
    <RNPSearchbar
      placeholder={t(placeholderProp)}
      onChangeText={onChange}
      value={value}
    />
  );
};
