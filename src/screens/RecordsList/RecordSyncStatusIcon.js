import React from "react";
import PropTypes from "prop-types";

import { RecordSyncStatus } from "model/RecordSyncStatus";
import { Icon, Tooltip } from "components";

const colors = {
  red: "red",
  darkgrey: "darkgrey",
  yellow: "yellow",
  green: "green",
};

const colorBySyncStatus = {
  [RecordSyncStatus.keysNotSpecified]: colors.red,
  [RecordSyncStatus.new]: colors.darkgrey,
  [RecordSyncStatus.modifiedLocally]: colors.yellow,
  [RecordSyncStatus.modifiedRemotely]: colors.red,
  [RecordSyncStatus.notInEntryStepAnymore]: colors.red,
  [RecordSyncStatus.notModified]: colors.green,
  [RecordSyncStatus.notUpToDate]: colors.yellow,
};

export const RecordSyncStatusIcon = (props) => {
  const { item } = props;
  const { syncStatus } = item;

  if (!syncStatus || syncStatus === RecordSyncStatus.syncNotApplicable)
    return null;

  return (
    <Tooltip titleKey={`dataEntry:syncStatus.${syncStatus}`}>
      <Icon color={colorBySyncStatus[syncStatus]} size={24} source="circle" />
    </Tooltip>
  );
};

RecordSyncStatusIcon.propTypes = {
  item: PropTypes.object.isRequired,
};
