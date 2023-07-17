import React from "react";

import { Button, HView, Text, TextInput, VView } from "components";
import { SrsDropdown } from "../../../SrsDropdown";
import { AccuracyProgressBar } from "./AccuracyProgressBar";
import { useNodeCoordinateComponent } from "./useNodeCoordinateComponent";
import styles from "./styles";
import { LocationNavigator } from "./LocationNavigator";

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
        <Text style={styles.formItemLabel} textKey="common:srs" />
        <SrsDropdown editable={editable} onChange={onChangeSrs} value={srsId} />
      </HView>
      <HView style={styles.accuracyFormItem}>
        <Text
          style={styles.formItemLabel}
          textKey="dataEntry:coordinate.accuracy"
        />
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
        <Button
          onPress={onStartGpsPress}
          textKey="dataEntry:coordinate.startGPS"
        />
      )}
      {watchingLocation && (
        <Button
          onPress={onStopGpsPress}
          textKey="dataEntry:coordinate.stopGPS"
        />
      )}
      <LocationNavigator />
    </VView>
  );
};
