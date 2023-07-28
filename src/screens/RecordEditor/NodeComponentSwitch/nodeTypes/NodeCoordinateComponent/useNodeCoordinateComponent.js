import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
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

import { RecordNodes } from "model/utils/RecordNodes";
import { DataEntrySelectors, SettingsSelectors, SurveySelectors } from "state";
import { useNodeComponentLocalState } from "../../../useNodeComponentLocalState";
import { SurveyNodeDefs } from "model/utils/SurveyNodeDefs";

const stringToNumber = (str) => Numbers.toNumber(str);
const numberToString = (num) => (Objects.isEmpty(num) ? "" : String(num));

const locationToUiValue = ({ location, nodeDef, srsTo, srsIndex }) => {
  const { coords } = location;
  const { latitude, longitude, accuracy } = coords;

  const pointLatLong = PointFactory.createInstance({
    x: longitude,
    y: latitude,
  });
  const point = Points.transform(pointLatLong, srsTo, srsIndex);
  const { x, y } = point;

  const includedExtraFields =
    SurveyNodeDefs.getCoordinateNodeDefIncludedExtraFields(nodeDef);

  const result = {
    x: numberToString(x),
    y: numberToString(y),
    srs: srsTo,
  };

  includedExtraFields.forEach((field) => {
    result[field] = coords[field];
  });
  // always include accuracy
  result["accuracy"] = String(Math.floor(accuracy * 100) / 100);
  return result;
};

export const useNodeCoordinateComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  const survey = SurveySelectors.useCurrentSurvey();
  const srsIndex = SurveySelectors.useCurrentSurveySrsIndex();
  const srss = useMemo(() => Surveys.getSRSs(survey), [survey]);
  const includedExtraFields = useMemo(
    () => SurveyNodeDefs.getCoordinateNodeDefIncludedExtraFields(nodeDef),
    [nodeDef]
  );

  const settings = SettingsSelectors.useSettings();
  const { locationAccuracyThreshold, locationAccuracyWatchTimeout } = settings;

  const [state, setState] = useState({
    compassNavigatorVisible: false,
    watchingLocation: false,
  });

  const locationSubscritionRef = useRef(null);
  const locationAccuracyWatchTimeoutRef = useRef(null);

  const { compassNavigatorVisible, watchingLocation } = state;

  const nodeValueToUiValue = useCallback(
    (nodeValue) => {
      const { x, y, srs = srss[0].code } = nodeValue || {};

      const result = {
        x: numberToString(x),
        y: numberToString(y),
        srs,
      };
      includedExtraFields.forEach((fieldKey) => {
        result[fieldKey] = numberToString(nodeValue?.[fieldKey]);
      });
      return result;
    },
    [nodeDef, srss]
  );

  const uiValueToNodeValue = useCallback(
    (uiValue) => {
      const { x, y, srs } = uiValue || {};

      if (Objects.isEmpty(x) && Objects.isEmpty(y)) return null;

      const result = {
        x: stringToNumber(x),
        y: stringToNumber(y),
        srs,
      };

      includedExtraFields.forEach((fieldKey) => {
        result[fieldKey] = stringToNumber(uiValue?.[fieldKey]);
      });
      return result;
    },
    [nodeDef]
  );

  const { applicable, uiValue, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
    updateDelay: 500,
    nodeValueToUiValue,
    uiValueToNodeValue,
  });

  const distanceTarget = useSelector((state) => {
    const record = DataEntrySelectors.selectRecord(state);
    const node = Records.getNodeByUuid(nodeUuid)(record);
    return RecordNodes.getCoordinateDistanceTarget({
      survey,
      nodeDef,
      record,
      node,
    });
  }, Objects.isEqual);

  const editable =
    !NodeDefs.isReadOnly(nodeDef) &&
    !NodeDefs.isAllowOnlyDeviceCoordinate(nodeDef);

  const { accuracy, x, y, srs = srss[0].code } = uiValue || {};

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

  const onChangeValueField = (fieldKey) => (val) =>
    onValueChange({ ...uiValue, [fieldKey]: val });

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
        const valueNext = locationToUiValue({
          location,
          nodeDef,
          srsTo: srs,
          srsIndex,
        });

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
    nodeDef,
    srs,
    srsIndex,
    locationAccuracyThreshold,
    locationAccuracyWatchTimeout,
  ]);

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
      const valueNext = locationToUiValue({
        location,
        nodeDef,
        srsTo: srs,
        srsIndex,
      });
      onValueChange(valueNext);
    },
    [nodeDef, srs, onValueChange]
  );

  return {
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
  };
};
