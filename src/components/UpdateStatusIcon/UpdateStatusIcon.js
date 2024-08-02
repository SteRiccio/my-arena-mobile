import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { UpdateStatus } from "model";

import { IconButton } from "../IconButton";

import styles from "./styles";

const iconByUpdateStatus = {
  [UpdateStatus.loading]: "loading",
  [UpdateStatus.upToDate]: "check",
  [UpdateStatus.networkNotAvailable]: "alert",
  [UpdateStatus.notUpToDate]: "alert",
  [UpdateStatus.error]: "alert-circle",
};

export const UpdateStatusIcon = ({ loading, updateStatus, onPress }) => {
  const icon = useMemo(
    () => (loading ? "loading" : iconByUpdateStatus[updateStatus]),
    [loading, updateStatus]
  );

  return (
    <IconButton
      disabled={loading}
      icon={icon}
      style={styles.updateStatusIconButton}
      onPress={onPress}
    />
  );
};

UpdateStatusIcon.propTypes = {
  loading: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  updateStatus: PropTypes.string.isRequired,
};
