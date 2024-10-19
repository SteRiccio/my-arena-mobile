import PropTypes from "prop-types";

import { ScrollView } from "../ScrollView";

import styles from "./styles";

export const ScreenView = ({ children }) => (
  <ScrollView style={styles.container}>{children}</ScrollView>
);

ScreenView.propTypes = {
  children: PropTypes.node,
};
