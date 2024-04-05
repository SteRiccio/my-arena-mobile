import React from "react";
import PropTypes from "prop-types";

import { RecordSyncStatus } from "model/RecordSyncStatus";
import { Icon, Tooltip } from "components";

const colorBySyncStatus = {
  [RecordSyncStatus.keysNotSpecified]: "red",
  [RecordSyncStatus.new]: "darkgrey",
  [RecordSyncStatus.modifiedLocally]: "yellow",
  [RecordSyncStatus.modifiedRemotely]: "red",
  [RecordSyncStatus.notInEntryStepAnymore]: "red",
  [RecordSyncStatus.notModified]: "green",
};

export const RecordSyncStatusIcon = (props) => {
  const { item } = props;
  const { syncStatus } = item;

  if (!syncStatus) return null;

  return (
    <Tooltip titleKey={`dataEntry:syncStatus.${syncStatus}`}>
      <Icon color={colorBySyncStatus[syncStatus]} size={24} source="circle" />
    </Tooltip>
  );
};

RecordSyncStatusIcon.propTypes = {
  item: PropTypes.object.isRequired,
};
