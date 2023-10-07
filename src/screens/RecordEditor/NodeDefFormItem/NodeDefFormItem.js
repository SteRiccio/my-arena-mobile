import React from "react";
import { View } from "react-native";

import { NodeDefs, Objects } from "@openforis/arena-core";

import {
  DataEntrySelectors,
  SettingsSelectors,
  SurveyOptionsSelectors,
} from "state";

import { Fade, VView } from "components";
import { RecordEditViewMode } from "model";

import { NodeComponentSwitch } from "../NodeComponentSwitch/NodeComponentSwitch";

import { NodeDefFormItemHeader } from "./NodeDefFormItemHeader";

import styles from "./styles.js";

export const NodeDefFormItem = (props) => {
  const { nodeDef, parentNodeUuid, onFocus } = props;

  if (__DEV__) {
    console.log(`Rendering form item ${nodeDef.props.name}`);
  }
  const settings = SettingsSelectors.useSettings();

  const alwaysVisible = Objects.isEmpty(NodeDefs.getApplicable(nodeDef));

  const visible = DataEntrySelectors.useRecordNodePointerVisibility({
    parentNodeUuid,
    nodeDefUuid: nodeDef.uuid,
  });
  const viewMode = SurveyOptionsSelectors.useRecordEditViewMode();

  const internalComponent = (
    <VView
      style={[
        styles.externalContainer,
        viewMode === RecordEditViewMode.oneNode ? { flex: 1 } : {},
      ]}
    >
      <NodeDefFormItemHeader
        nodeDef={nodeDef}
        parentNodeUuid={parentNodeUuid}
      />
      <View
        style={[
          styles.internalContainer,
          viewMode === RecordEditViewMode.oneNode ? { flex: 1 } : {},
        ]}
      >
        <NodeComponentSwitch
          nodeDef={nodeDef}
          parentNodeUuid={parentNodeUuid}
          onFocus={onFocus}
        />
      </View>
    </VView>
  );

  if (alwaysVisible) {
    return internalComponent;
  }

  if (settings.animationsEnabled && viewMode !== RecordEditViewMode.oneNode) {
    return <Fade visible={visible}>{internalComponent}</Fade>;
  }

  return visible ? internalComponent : null;
};
