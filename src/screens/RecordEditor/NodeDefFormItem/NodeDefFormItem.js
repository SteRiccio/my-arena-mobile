import React from "react";
import { View } from "react-native";

import { SurveySelectors } from "../../../state/survey/selectors";

import { Text } from "../../../components";

import { NodeValidationIcon } from "../NodeValidationIcon/NodeValidationIcon";
import styles from "./styles.js";
import { NodeComponentSwitch } from "../NodeComponentSwitch/NodeComponentSwitch";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";

export const NodeDefFormItem = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  console.log(`Rendering form item ${nodeDef.props.name}`);

  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const visible = DataEntrySelectors.useRecordNodePointerVisibility({
    parentNodeUuid,
    nodeDefUuid: nodeDef.uuid,
  });

  if (!visible) return null;

  return (
    <View style={styles.externalContainer}>
      <View style={styles.nodeDefLabelContainer}>
        <Text
          style={styles.nodeDefLabel}
          textKey={nodeDef.props.labels[lang] || nodeDef.props.name}
        />
        <NodeValidationIcon nodeDef={nodeDef} parentNodeUuid={parentNodeUuid} />
      </View>
      <View style={styles.internalContainer}>
        {
          <NodeComponentSwitch
            nodeDef={nodeDef}
            parentNodeUuid={parentNodeUuid}
          />
        }
      </View>
    </View>
  );
};
