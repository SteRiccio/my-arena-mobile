import React from "react";
import { View } from "react-native";
import ViewMoreText from "react-native-view-more-text";

import { NodeDefs, Objects } from "@openforis/arena-core";

import {
  DataEntrySelectors,
  SettingsSelectors,
  SurveyOptionsSelectors,
  SurveySelectors,
} from "state";

import { Fade, Text, VView } from "components";
import { RecordEditViewMode } from "model";

import { NodeValidationIcon } from "../NodeValidationIcon/NodeValidationIcon";
import { NodeComponentSwitch } from "../NodeComponentSwitch/NodeComponentSwitch";

import styles from "./styles.js";

export const NodeDefFormItem = (props) => {
  const { nodeDef, parentNodeUuid, onFocus } = props;

  if (__DEV__) {
    console.log(`Rendering form item ${nodeDef.props.name}`);
  }
  const settings = SettingsSelectors.useSettings();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const alwaysVisible = Objects.isEmpty(NodeDefs.getApplicable(nodeDef));

  const visible = DataEntrySelectors.useRecordNodePointerVisibility({
    parentNodeUuid,
    nodeDefUuid: nodeDef.uuid,
  });
  const viewMode = SurveyOptionsSelectors.useRecordEditViewMode();

  const labelOrName = NodeDefs.getLabelOrName(nodeDef, lang);
  const description = nodeDef.props?.descriptions?.[lang];

  const internalComponent = (
    <VView
      style={[
        styles.externalContainer,
        viewMode === RecordEditViewMode.oneNode ? { flex: 1 } : {},
      ]}
    >
      <View style={styles.nodeDefLabelContainer}>
        <Text style={styles.nodeDefLabel}>{labelOrName}</Text>
        <NodeValidationIcon nodeDef={nodeDef} parentNodeUuid={parentNodeUuid} />
      </View>
      {!Objects.isEmpty(description) && (
        <ViewMoreText
          textStyle={styles.nodeDefDescriptionViewMoreText}
          numberOfLines={2}
        >
          <Text style={styles.nodeDefDescriptionText}>{description}</Text>
        </ViewMoreText>
      )}
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
