import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

import {
  NodeDefs,
  Numbers,
  Objects,
  PointFactory,
  Points,
  Records,
  Surveys,
} from "@openforis/arena-core";

import { DataEntrySelectors, SettingsSelectors, SurveySelectors } from "state";
import { useNodeComponentLocalState } from "../../../useNodeComponentLocalState";
import { RecordNodes } from "model/utils/RecordNodes";

const stringToNumber = (str) => Numbers.toNumber(str);
const numberToString = (num) => (Objects.isEmpty(num) ? "" : String(num));

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

  return { x, y, srs: srsTo, accuracy: accuracyFormatted };
};

export const useNodeCoordinateComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  const settings = SettingsSelectors.useSettings();
  const { locationAccuracyThreshold, locationAccuracyWatchTimeout } = settings;

  const [state, setState] = useState({
    compassNavigatorVisible: false,
    watchingLocation: false,
  });

  const locationSubscritionRef = useRef(null);
  const locationAccuracyWatchTimeoutRef = useRef(null);

  const { compassNavigatorVisible, watchingLocation } = state;

  const { applicable, value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
    updateDelay: 500,
  });

  const survey = SurveySelectors.useCurrentSurvey();
  const srsIndex = SurveySelectors.useCurrentSurveySrsIndex();
  const srss = Surveys.getSRSs(survey);
  const record = DataEntrySelectors.useRecord();
  const node = Records.getNodeByUuid(nodeUuid)(record);

  const distanceTarget = RecordNodes.getCoordinateDistanceTarget({
    survey,
    nodeDef,
    record,
    node,
  });

  const editable =
    !NodeDefs.isReadOnly(nodeDef) &&
    !NodeDefs.isAllowOnlyDeviceCoordinate(nodeDef);

  const { accuracy, x, y, srs = srss[0].code } = value || {};

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
      if (!valueNext.srs && srss.length === 1) {
        // set default SRS
        valueNext.srs = srss[0].code;
      }
      updateNodeValue(valueNext);
    },
    [srss, updateNodeValue]
  );

  const onChangeX = useCallback(
    (xStr) => onValueChange({ ...value, x: stringToNumber(xStr) }),
    [value, onValueChange]
  );

  const onChangeY = useCallback(
    (yStr) => onValueChange({ ...value, y: stringToNumber(yStr) }),
    [value, onValueChange]
  );

  const onChangeSrs = useCallback(
    (srs) => onValueChange({ ...value, srs }),
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
        const valueNext = locationToValue({ location, srsTo: srs, srsIndex });

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
  }, [srs, srsIndex, locationAccuracyThreshold, locationAccuracyWatchTimeout]);

  const onStopGpsPress = useCallback(() => {
    stopGps();
  }, []);

  const showCompassNavigator = useCallback(
    () =>
      setState((statePrev) => ({
        ...statePrev,
        compassNavigatorVisible: true,
      })),
    []
  );

  const hideCompassNavigator = useCallback(
    () =>
      setState((statePrev) => ({
        ...statePrev,
        compassNavigatorVisible: false,
      })),
    []
  );

  const onCompassNavigatorUseCurrentLocation = useCallback(
    (location) => {
      const valueNext = locationToValue({ location, srsTo: srs, srsIndex });
      onValueChange(valueNext);
    },
    [srs, onValueChange]
  );

  return {
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
  };
};
