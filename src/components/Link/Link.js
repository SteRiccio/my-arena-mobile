import { Linking } from "react-native";
import { Paragraph } from "react-native-paper";
import PropTypes from "prop-types";

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

Link.propTypes = {
  labelKey: PropTypes.string.isRequired,
  labelParams: PropTypes.object,
  url: PropTypes.string.isRequired,
};
