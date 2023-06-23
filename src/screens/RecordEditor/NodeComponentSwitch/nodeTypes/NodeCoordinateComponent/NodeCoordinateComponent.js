import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Location from "expo-location";

import {
  NodeDefs,
  Objects,
  PointFactory,
  Points,
  Surveys,
} from "@openforis/arena-core";

import { Button, HView, Text, TextInput, VView } from "components";
import { SettingsSelectors, SurveySelectors } from "state";
import { SrsDropdown } from "../../../SrsDropdown";
import { useNodeComponentLocalState } from "../../../useNodeComponentLocalState";
import { AccuracyProgressBar } from "./AccuracyProgressBar";
import styles from "./nodeCoordinateComponentStyles";

const locationToValue = ({ location, srsTo, srsIndex }) => {
  const { coords } = location;
  const { latitude, longitude, accuracy } = coords;
  const accuracyFormatted = Math.floor(accuracy * 100) / 100;

  const pointLatLong = PointFactory.createInstance({
    x: longitude,
    y: latitude,
  });
  const point = Points.transform(pointLatLong, srsTo, srsIndex);
  const { x, y } = point;

  return { x, y, srsId: srsTo, accuracy: accuracyFormatted };
};

export const NodeCoordinateComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeCoordinateComponent for ${nodeDef.props.name}`);
  }

  const settings = SettingsSelectors.useSettings();
  const { locationAccuracyThreshold } = settings;

  const [state, setState] = useState({
    watchingLocation: false,
  });

  const locationSubscritionRef = useRef(null);

  const { watchingLocation } = state;

  const { applicable, value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
    updateDelay: 500,
  });

  const survey = SurveySelectors.useCurrentSurvey();
  const srss = Surveys.getSRSs(survey);
  const srsIndex = useMemo(() => Surveys.getSRSIndex(survey), [srss]);

  const editable =
    !NodeDefs.isReadOnly(nodeDef) &&
    !NodeDefs.isAllowOnlyDeviceCoordinate(nodeDef);

  const { accuracy, x, y, srsId = srss[0].code } = value || {};

  const numberToString = (num) => (Objects.isEmpty(num) ? "" : String(num));
  const xTextValue = numberToString(x);
  const yTextValue = numberToString(y);

  const stopGps = () => {
    locationSubscritionRef.current?.remove();
    locationSubscritionRef.current = null;
  };

  useEffect(() => {
    return stopGps;
  }, []);

  const onValueChange = useCallback(
    (valueNext) => {
      if (!valueNext.srsId && srss.length === 1) {
        // set default SRS
        valueNext.srsId = srss[0].code;
      }
      updateNodeValue(valueNext);
    },
    [srss, updateNodeValue]
  );

  const onChangeX = useCallback(
    (x) => onValueChange({ ...value, x }),
    [value, onValueChange]
  );

  const onChangeY = useCallback(
    (y) => onValueChange({ ...value, y }),
    [value, onValueChange]
  );

  const onChangeSrs = useCallback(
    (srsId) => onValueChange({ ...value, srsId }),
    [value, updateNodeValue]
  );

  const onStartGpsPress = useCallback(async () => {
    const foregroundPermission =
      await Location.requestForegroundPermissionsAsync();
    if (!foregroundPermission.granted) {
      return;
    }
    locationSubscritionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      },
      (location) => {
        const valueNext = locationToValue({ location, srsTo: srsId, srsIndex });

        onValueChange(valueNext);
        if (valueNext.accuracy <= locationAccuracyThreshold) {
          stopGps();
        }
      }
    );
    setState((statePrev) => ({ ...statePrev, watchingLocation: true }));
  }, [srsId, srsIndex]);

  const onStopGpsPress = useCallback(() => {
    stopGps();
    setState((statePrev) => ({ ...statePrev, watchingLocation: false }));
  });

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
