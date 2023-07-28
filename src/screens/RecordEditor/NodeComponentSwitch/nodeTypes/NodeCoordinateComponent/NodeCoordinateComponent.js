import React, { useCallback } from "react";

import { Objects } from "@openforis/arena-core";

import { Button, HView, IconButton, Text, TextInput, VView } from "components";
import { SrsDropdown } from "../../../SrsDropdown";
import { AccuracyProgressBar } from "./AccuracyProgressBar";
import { useNodeCoordinateComponent } from "./useNodeCoordinateComponent";
import { LocationNavigator } from "./LocationNavigator";
import { OpenMapButton } from "./OpenMapButton";

import styles from "./styles";

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
    includedExtraFields,
    locationAccuracyThreshold,
    onChangeValueField,
    onCompassNavigatorUseCurrentLocation,
    onStartGpsPress,
    onStopGpsPress,
    showCompassNavigator,
    srs,
    srsIndex,
    uiValue,
    watchingLocation,
  } = useNodeCoordinateComponent(props);

  const createNumericFieldFormItem = useCallback(
    ({ fieldKey }) => (
      <HView style={styles.formItem}>
        <Text
          style={styles.formItemLabel}
          textKey={`dataEntry:coordinate.${fieldKey}`}
        />
        <TextInput
          editable={editable}
          keyboardType="numeric"
          style={[
            styles.numericTextInput,
            ...(applicable ? [] : [styles.textInputNotApplicable]),
          ]}
          onChange={onChangeValueField(fieldKey)}
          value={uiValue[fieldKey]}
        />
      </HView>
    ),
    [applicable, editable, uiValue]
  );

  return (
    <VView>
      <HView style={{ alignItems: "center" }}>
        <VView>
          {createNumericFieldFormItem({ fieldKey: "x" })}
          {createNumericFieldFormItem({ fieldKey: "y" })}
        </VView>
        <VView>
          {uiValue && <OpenMapButton point={uiValue} srsIndex={srsIndex} />}
          {distanceTarget && (
            <IconButton
              icon="compass-outline"
              onPress={showCompassNavigator}
              size={50}
              style={{ alignSelf: "center", margin: 20 }}
            />
          )}
        </VView>
      </HView>
      <HView style={styles.formItem}>
        <Text style={styles.formItemLabel} textKey="common:srs" />
        <SrsDropdown
          editable={editable}
          onChange={onChangeValueField("srs")}
          value={srs}
        />
      </HView>
      {includedExtraFields.map((fieldKey) =>
        createNumericFieldFormItem({ fieldKey })
      )}
      {
        // always show accuracy (as read-only if not included in extra fields)
        !Objects.isEmpty(accuracy) &&
          !includedExtraFields.includes("accuracy") && (
            <HView style={styles.accuracyFormItem}>
              <Text
                style={styles.formItemLabel}
                textKey="dataEntry:coordinate.accuracy"
              />
              <Text style={styles.accuracyField} textKey={accuracy} />
              <Text style={styles.formItemLabel} textKey="m" />
            </HView>
          )
      }
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
          targetPoint={distanceTarget}
        />
      )}
    </VView>
  );
};
