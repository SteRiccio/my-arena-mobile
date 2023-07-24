import React from "react";

import { Button, HView, IconButton, Text, TextInput, VView } from "components";
import { SrsDropdown } from "../../../SrsDropdown";
import { AccuracyProgressBar } from "./AccuracyProgressBar";
import { useNodeCoordinateComponent } from "./useNodeCoordinateComponent";
import { LocationNavigator } from "./LocationNavigator";
import styles from "./styles";
import { Objects } from "@openforis/arena-core";

export const NodeCoordinateComponent = (props) => {
  const { nodeDef } = props;

  if (__DEV__) {
    console.log(`rendering NodeCoordinateComponent for ${nodeDef.props.name}`);
  }

  const {
    accuracy,
    applicable,
    compassNavigatorVisible,
    distanceTarget,
    editable,
    hideCompassNavigator,
    locationAccuracyThreshold,
    onChangeX,
    onChangeY,
    onChangeSrs,
    onCompassNavigatorUseCurrentLocation,
    onStartGpsPress,
    onStopGpsPress,
    showCompassNavigator,
    srs,
    xTextValue,
    yTextValue,
    watchingLocation,
  } = useNodeCoordinateComponent(props);

  return (
    <VView>
      <HView style={{ alignItems: "center" }}>
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
        </VView>
        {distanceTarget && (
          <IconButton
            icon="compass-outline"
            onPress={showCompassNavigator}
            size={50}
            style={{ alignSelf: "center", margin: 20 }}
          />
        )}
      </HView>
      <HView style={styles.formItem}>
        <Text style={styles.formItemLabel} textKey="common:srs" />
        <SrsDropdown editable={editable} onChange={onChangeSrs} value={srs} />
      </HView>
      {!Objects.isEmpty(accuracy) && (
        <HView style={styles.accuracyFormItem}>
          <Text
            style={styles.formItemLabel}
            textKey="dataEntry:coordinate.accuracy"
          />
          <Text style={styles.accuracyField} textKey={accuracy} />
          <Text style={styles.formItemLabel} textKey="m" />
        </HView>
      )}
      {watchingLocation && (
        <AccuracyProgressBar
          accuracy={accuracy}
          accuracyThreshold={locationAccuracyThreshold}
        />
      )}
      {!watchingLocation && (
        <Button
          icon="play"
          onPress={onStartGpsPress}
          textKey="dataEntry:coordinate.startGPS"
        />
      )}
      {watchingLocation && (
        <Button
          icon="stop"
          onPress={onStopGpsPress}
          textKey="dataEntry:coordinate.stopGPS"
        />
      )}

      {compassNavigatorVisible && (
        <LocationNavigator
          onDismiss={hideCompassNavigator}
          onUseCurrentLocation={onCompassNavigatorUseCurrentLocation}
          targetLocation={distanceTarget}
        />
      )}
    </VView>
  );
};
