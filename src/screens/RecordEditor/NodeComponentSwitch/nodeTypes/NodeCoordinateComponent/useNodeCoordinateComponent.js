import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  NodeDefs,
  Numbers,
  Objects,
  PointFactory,
  Points,
  Records,
  Surveys,
} from "@openforis/arena-core";

import { NumberUtils } from "utils/NumberUtils";
import { RecordNodes } from "model/utils/RecordNodes";
import { DataEntrySelectors, SurveySelectors } from "state";
import { useNodeComponentLocalState } from "../../../useNodeComponentLocalState";
import { useLocationWatch } from "hooks";

const stringToNumber = (str) => Numbers.toNumber(str);
const numberToString = (num, roundToDecimals = NaN) => {
  if (Objects.isEmpty(num)) return "";
  return String(
    Number.isNaN(roundToDecimals)
      ? num
      : NumberUtils.roundToDecimals(num, roundToDecimals)
  );
};

const locationToUiValue = ({ location, nodeDef, srsTo, srsIndex }) => {
  const { coords } = location;
  const { latitude, longitude, accuracy } = coords;

  const pointLatLong = PointFactory.createInstance({
    x: longitude,
    y: latitude,
  });
  const point = Points.transform(pointLatLong, srsTo, srsIndex);
  const { x, y } = point;

  const includedExtraFields = NodeDefs.getCoordinateAdditionalFields(nodeDef);

  const result = {
    x: numberToString(x),
    y: numberToString(y),
    srs: srsTo,
  };

  includedExtraFields.forEach((field) => {
    result[field] = numberToString(coords[field], 2);
  });
  // always include accuracy
  result["accuracy"] = numberToString(accuracy, 2);
  return result;
};

export const useNodeCoordinateComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  const survey = SurveySelectors.useCurrentSurvey();
  const srsIndex = SurveySelectors.useCurrentSurveySrsIndex();
  const srss = useMemo(() => Surveys.getSRSs(survey), [survey]);
  const includedExtraFields = useMemo(
    () => NodeDefs.getCoordinateAdditionalFields(nodeDef),
    [nodeDef]
  );

  const [state, setState] = useState({
    compassNavigatorVisible: false,
  });

  const { compassNavigatorVisible } = state;

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
    [includedExtraFields, srss]
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
    [includedExtraFields]
  );

  const { applicable, uiValue, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
    updateDelay: 500,
    nodeValueToUiValue,
    uiValueToNodeValue,
  });

  const { accuracy, srs = srss[0].code } = uiValue || {};

  const locationCallback = useCallback(
    ({ location }) => {
      if (!location) return;

      const valueNext = locationToUiValue({
        location,
        nodeDef,
        srsTo: srs,
        srsIndex,
      });

      onValueChange(valueNext);
    },
    [srs]
  );

  const {
    locationAccuracyThreshold,
    locationWatchElapsedTime,
    locationWatchProgress,
    locationWatchTimeout,
    startLocationWatch,
    stopLocationWatch,
    watchingLocation,
  } = useLocationWatch({ locationCallback });

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

  useEffect(() => {
    return stopLocationWatch;
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
    await startLocationWatch();
  }, [startLocationWatch]);

  const onStopGpsPress = useCallback(() => {
    stopLocationWatch();
  }, [stopLocationWatch]);

  const setCompassNavigatorVisible = useCallback(
    (visible) =>
      setState((statePrev) => ({
        ...statePrev,
        compassNavigatorVisible: visible,
      })),
    []
  );

  const showCompassNavigator = useCallback(
    () => setCompassNavigatorVisible(true),
    [setCompassNavigatorVisible]
  );
  const hideCompassNavigator = useCallback(
    () => setCompassNavigatorVisible(false),
    [setCompassNavigatorVisible]
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
    locationWatchElapsedTime,
    locationWatchProgress,
    locationWatchTimeout,
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
