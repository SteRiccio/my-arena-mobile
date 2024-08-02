import PropTypes from "prop-types";

import { Text } from "components";

import styles from "./EntityButtonStyles";

export const EntityButton = ({ treeNode, isCurrentEntity }) => {
  const { label } = treeNode;

  return (
    <Text
      style={
        isCurrentEntity ? styles.entityButtonCurrentEntity : styles.entityButton
      }
      textKey={label}
    />
  );
};

EntityButton.propTypes = {
  treeNode: PropTypes.object.isRequired,
  isCurrentEntity: PropTypes.bool,
};
