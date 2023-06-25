import { SegmentedButtons as RNPSegmentedButtons } from "react-native-paper";

import { useTranslation } from "localization";

export const SegmentedButtons = (props) => {
  const { buttons, onChange, value } = props;

  const { t } = useTranslation();

  return (
    <RNPSegmentedButtons
      buttons={buttons.map(({ value, label }) => ({
        value,
        label: t(label),
      }))}
      onValueChange={onChange}
      value={value}
    />
  );
};
