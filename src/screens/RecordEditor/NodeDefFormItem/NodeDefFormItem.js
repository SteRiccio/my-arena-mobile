import React from "react";
import PropTypes from "prop-types";
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

import { useStyles } from "./styles.js";

export const NodeDefFormItem = (props) => {
  const { nodeDef, parentNodeUuid, onFocus } = props;

  if (__DEV__) {
    console.log(`Rendering form item ${nodeDef.props.name}`);
  }
  const styles = useStyles();
  const settings = SettingsSelectors.useSettings();

  const alwaysVisible = Objects.isEmpty(NodeDefs.getApplicable(nodeDef));

  const visible = DataEntrySelectors.useRecordNodePointerVisibility({
    parentNodeUuid,
    nodeDefUuid: nodeDef.uuid,
  });
  const viewMode = SurveyOptionsSelectors.useRecordEditViewMode();

  const formItemComponent = (
    <VView
      style={[
        styles.formItem,
        viewMode === RecordEditViewMode.oneNode ? styles.formItemOneNode : {},
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
    return formItemComponent;
  }

  if (settings.animationsEnabled && viewMode !== RecordEditViewMode.oneNode) {
    return <Fade visible={visible}>{formItemComponent}</Fade>;
  }

  return visible ? formItemComponent : null;
};

NodeDefFormItem.propTypes = {
  nodeDef: PropTypes.object.isRequired,
  parentNodeUuid: PropTypes.string,
  onFocus: PropTypes.func,
};
