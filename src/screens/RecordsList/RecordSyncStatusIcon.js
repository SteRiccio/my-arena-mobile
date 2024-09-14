import React from "react";
import PropTypes from "prop-types";

import { RecordSyncStatus } from "model/RecordSyncStatus";
import { HView, Icon, Text, Tooltip } from "components";

const colors = {
  red: "red",
  darkgrey: "darkgrey",
  yellow: "yellow",
  green: "green",
};

const colorBySyncStatus = {
  [RecordSyncStatus.keysNotSpecified]: colors.red,
  [RecordSyncStatus.conflictingKeys]: colors.red,
  [RecordSyncStatus.new]: colors.darkgrey,
  [RecordSyncStatus.modifiedLocally]: colors.yellow,
  [RecordSyncStatus.modifiedRemotely]: colors.red,
  [RecordSyncStatus.notInEntryStepAnymore]: colors.red,
  [RecordSyncStatus.notModified]: colors.green,
  [RecordSyncStatus.notUpToDate]: colors.yellow,
};

export const RecordSyncStatusIcon = (props) => {
  const { item, showLabel } = props;
  const { syncStatus } = item;

  if (!syncStatus || syncStatus === RecordSyncStatus.syncNotApplicable)
    return null;

  const iconColor = colorBySyncStatus[syncStatus];

  const icon = <Icon color={iconColor} size={24} source="circle" />;

  const textKey = `dataEntry:syncStatus.${syncStatus}`;

  return showLabel ? (
    <HView>
      {icon}
      <Text textKey={textKey} />
    </HView>
  ) : (
    <Tooltip titleKey={textKey}>{icon}</Tooltip>
  );
};

RecordSyncStatusIcon.propTypes = {
  item: PropTypes.object.isRequired,
  showLabel: PropTypes.bool,
};
