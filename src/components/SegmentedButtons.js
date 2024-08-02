import { SegmentedButtons as RNPSegmentedButtons } from "react-native-paper";

import { useTranslation } from "localization";

export const SegmentedButtons = (props) => {
  const { buttons, onChange, style, value } = props;

  const { t } = useTranslation();

  return (
    <RNPSegmentedButtons
      buttons={buttons.map(({ icon, label, value }) => ({
        icon,
        label: t(label),
        value,
      }))}
      onValueChange={onChange}
      style={style}
      value={value}
    />
  );
};
