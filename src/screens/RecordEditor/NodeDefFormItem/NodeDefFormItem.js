import React, { useState } from "react";
import { Animated, View } from "react-native";

import { NodeDefs, Objects } from "@openforis/arena-core";

import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { SurveySelectors } from "../../../state/survey/selectors";

import { Text } from "../../../components";

import { NodeValidationIcon } from "../NodeValidationIcon/NodeValidationIcon";
import { NodeComponentSwitch } from "../NodeComponentSwitch/NodeComponentSwitch";
import styles from "./styles.js";

export const NodeDefFormItem = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  if (__DEV__) {
    console.log(`Rendering form item ${nodeDef.props.name}`);
  }
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const alwaysVisible = Objects.isEmpty(NodeDefs.getApplicable(nodeDef));

  const visible = DataEntrySelectors.useRecordNodePointerVisibility({
    parentNodeUuid,
    nodeDefUuid: nodeDef.uuid,
  });

  const initialOpacity = visible ? 1 : 0;
  const [fadeAnim] = useState(new Animated.Value(initialOpacity));

  React.useEffect(() => {
    if (!alwaysVisible) {
      const toValue = visible ? 1 : 0;
      Animated.timing(fadeAnim, { toValue, duration: 1000 }).start();
    }
  }, [alwaysVisible, visible]);

  const labelOrName = nodeDef.props.labels?.[lang] || nodeDef.props.name;

  const internalComponent = (
    <View style={styles.externalContainer}>
      <View style={styles.nodeDefLabelContainer}>
        <Text style={styles.nodeDefLabel} textKey={labelOrName} />
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

  if (alwaysVisible) {
    return internalComponent;
  }

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {internalComponent}
    </Animated.View>
  );
};
