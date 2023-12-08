import React from "react";

import { IconButton } from "components/IconButton";
import { RecordSyncStatus } from "model/RecordSyncStatus";
import { Tooltip } from "components";

const colorBySyncStatus = {
  [RecordSyncStatus.keysNotSpecified]: "red",
  [RecordSyncStatus.new]: "white",
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
      <IconButton
        icon="circle"
        iconColor={colorBySyncStatus[syncStatus]}
        onPress={(e) => {
          // prevent table row press
          e?.preventDefault();
        }}
      />
    </Tooltip>
  );
};
