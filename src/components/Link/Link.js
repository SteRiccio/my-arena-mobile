import { Linking } from "react-native";
import { Paragraph } from "react-native-paper";

import { useTranslation } from "localization";

import styles from "./styles";

export const Link = (props) => {
  const { labelKey, labelParams, url } = props;
  const { t } = useTranslation();
  return (
    <Paragraph style={styles.paragraph} onPress={() => Linking.openURL(url)}>
      {t(labelKey, labelParams)}
    </Paragraph>
  );
};
