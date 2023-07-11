import React from "react";

import { Button, HView, Text, TextInput, VView } from "components";
import { SrsDropdown } from "../../../SrsDropdown";
import { AccuracyProgressBar } from "./AccuracyProgressBar";
import styles from "./nodeCoordinateComponentStyles";
import { useNodeCoordinateComponent } from "./useNodeCoordinateComponent";

export const NodeCoordinateComponent = (props) => {
  const { nodeDef } = props;

  if (__DEV__) {
    console.log(`rendering NodeCoordinateComponent for ${nodeDef.props.name}`);
  }

  const {
    accuracy,
    applicable,
    editable,
    locationAccuracyThreshold,
    onChangeX,
    onChangeY,
    onChangeSrs,
    onStartGpsPress,
    onStopGpsPress,
    srsId,
    xTextValue,
    yTextValue,
    watchingLocation,
  } = useNodeCoordinateComponent(props);

  return (
    <VView>
      <HView style={styles.formItem}>
        <Text style={styles.formItemLabel} textKey="X" />
        <TextInput
          editable={editable}
          keyboardType="numeric"
          style={[
            styles.numericTextInput,
            ...(applicable ? [] : [styles.textInputNotApplicable]),
          ]}
          onChange={onChangeX}
          value={xTextValue}
        />
      </HView>
      <HView style={styles.formItem}>
        <Text style={styles.formItemLabel} textKey="Y" />
        <TextInput
          editable={editable}
          keyboardType="numeric"
          style={[
            styles.numericTextInput,
            ...(applicable ? [] : [styles.textInputNotApplicable]),
          ]}
          onChange={onChangeY}
          value={yTextValue}
        />
      </HView>
      <HView style={styles.formItem}>
        <Text style={styles.formItemLabel} textKey="SRS" />
        <SrsDropdown editable={editable} onChange={onChangeSrs} value={srsId} />
      </HView>
      <HView style={styles.accuracyFormItem}>
        <Text style={styles.formItemLabel} textKey="Accuracy" />
        <Text style={styles.accuracyField} textKey={accuracy} />
        <Text style={styles.formItemLabel} textKey="m" />
      </HView>
      {watchingLocation && (
        <AccuracyProgressBar
          accuracy={accuracy}
          accuracyThreshold={locationAccuracyThreshold}
        />
      )}
      {!watchingLocation && (
        <Button onPress={onStartGpsPress}>Start GPS</Button>
      )}
      {watchingLocation && <Button onPress={onStopGpsPress}>Stop GPS</Button>}
    </VView>
  );
};
