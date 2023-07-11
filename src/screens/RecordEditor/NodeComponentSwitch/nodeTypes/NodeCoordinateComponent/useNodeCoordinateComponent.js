import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Location from "expo-location";

import {
  NodeDefs,
  Objects,
  PointFactory,
  Points,
  Surveys,
} from "@openforis/arena-core";

import { SettingsSelectors, SurveySelectors } from "state";
import { useNodeComponentLocalState } from "../../../useNodeComponentLocalState";

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

export const useNodeCoordinateComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  const settings = SettingsSelectors.useSettings();
  const { locationAccuracyThreshold, locationAccuracyWatchTimeout } = settings;

  const [state, setState] = useState({
    watchingLocation: false,
  });

  const locationSubscritionRef = useRef(null);
  const locationAccuracyWatchTimeoutRef = useRef(null);

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

  const clearLocationWatchTimeout = () => {
    if (locationAccuracyWatchTimeoutRef.current) {
      clearTimeout(locationAccuracyWatchTimeoutRef.current);
      locationAccuracyWatchTimeoutRef.current = null;
    }
  };

  const stopGps = () => {
    locationSubscritionRef.current?.remove();
    locationSubscritionRef.current = null;

    clearLocationWatchTimeout();

    setState((statePrev) => ({ ...statePrev, watchingLocation: false }));
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
    clearLocationWatchTimeout();
    locationSubscritionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 0.01,
      },
      (location) => {
        const valueNext = locationToValue({ location, srsTo: srsId, srsIndex });

        onValueChange(valueNext);

        if (valueNext.accuracy <= locationAccuracyThreshold) {
          stopGps();
        }
      }
    );
    locationAccuracyWatchTimeoutRef.current = setTimeout(
      stopGps,
      locationAccuracyWatchTimeout * 1000
    );

    setState((statePrev) => ({ ...statePrev, watchingLocation: true }));
  }, [
    srsId,
    srsIndex,
    locationAccuracyThreshold,
    locationAccuracyWatchTimeout,
  ]);

  const onStopGpsPress = useCallback(() => {
    stopGps();
  });

  return {
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
  };
};
