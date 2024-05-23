import React, { useCallback } from "react";

import { Objects } from "@openforis/arena-core";

import { HView, IconButton, Text, TextInput, VView } from "components";
import { LocationWatchingMonitor } from "components/LocationWatchingMonitor";
import { SrsDropdown } from "../../../SrsDropdown";
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
    locationWatchElapsedTime,
    locationWatchTimeout,
    onChangeSrs,
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
    ({ fieldKey, labelStyle = styles.formItemLabel }) => (
      <HView key={fieldKey} style={styles.formItem}>
        <Text style={labelStyle} textKey={`dataEntry:coordinate.${fieldKey}`} />
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
        <VView style={{ flex: 1 }}>
          {createNumericFieldFormItem({ fieldKey: "x" })}
          {createNumericFieldFormItem({ fieldKey: "y" })}
        </VView>
        <HView style={{ alignItems: "center" }}>
          {uiValue && <OpenMapButton point={uiValue} srsIndex={srsIndex} />}
          {distanceTarget && (
            <IconButton
              icon="compass-outline"
              onPress={showCompassNavigator}
              size={30}
              style={{ alignSelf: "center", margin: 20 }}
            />
          )}
        </HView>
      </HView>
      <HView style={styles.formItem}>
        <Text style={styles.formItemLabel} textKey="common:srs" />
        <SrsDropdown editable={editable} onChange={onChangeSrs} value={srs} />
      </HView>
      {includedExtraFields.map((fieldKey) =>
        createNumericFieldFormItem({
          fieldKey,
          labelStyle: styles.extraFieldFormItemLabel,
        })
      )}
      {
        // always show accuracy (as read-only if not included in extra fields)
        !Objects.isEmpty(accuracy) &&
          !includedExtraFields.includes("accuracy") &&
          createNumericFieldFormItem({
            fieldKey: "accuracy",
            labelStyle: styles.extraFieldFormItemLabel,
          })
      }
      <LocationWatchingMonitor
        locationAccuracy={accuracy}
        locationAccuracyThreshold={locationAccuracyThreshold}
        locationWatchElapsedTime={locationWatchElapsedTime}
        locationWatchTimeout={locationWatchTimeout}
        onStart={onStartGpsPress}
        onStop={onStopGpsPress}
        watchingLocation={watchingLocation}
      />
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
