import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  NodeDefs,
  Numbers,
  Objects,
  PointFactory,
  Points,
  Records,
  Surveys,
} from "@openforis/arena-core";

import { useLocationWatch } from "hooks";
import { RecordNodes } from "model/utils/RecordNodes";
import { ConfirmActions, DataEntrySelectors, SurveySelectors } from "state";
import { NumberUtils } from "utils";
import { useNodeComponentLocalState } from "../../../useNodeComponentLocalState";

const stringToNumber = (str) => Numbers.toNumber(str);
const numberToString = (num, roundToDecimals = NaN) => {
  if (Objects.isEmpty(num)) return "";
  return String(
    Number.isNaN(roundToDecimals)
      ? num
      : NumberUtils.roundToDecimals(num, roundToDecimals)
  );
};
const pointToUiValue = ({ x, y, srs }) => ({
  x: numberToString(x),
  y: numberToString(y),
  srs,
});

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

  const result = pointToUiValue({ x, y, srs: srsTo });

  includedExtraFields.forEach((field) => {
    result[field] = numberToString(coords[field], 2);
  });
  // always include accuracy
  result["accuracy"] = numberToString(accuracy, 2);
  return result;
};

export const useNodeCoordinateComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();
  const srsIndex = SurveySelectors.useCurrentSurveySrsIndex();
  const srss = useMemo(() => Surveys.getSRSs(survey), [survey]);
  const singleSrs = srss.length === 1;
  const defaultSrsCode = srss[0].code;
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
      const { x, y, srs = defaultSrsCode } = nodeValue || {};

      const result = pointToUiValue({ x, y, srs });
      includedExtraFields.forEach((fieldKey) => {
        result[fieldKey] = numberToString(nodeValue?.[fieldKey]);
      });
      return result;
    },
    [includedExtraFields, defaultSrsCode]
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

  const { applicable, uiValue, updateNodeValue, getUiValueFromState } =
    useNodeComponentLocalState({
      nodeUuid,
      updateDelay: 500,
      nodeValueToUiValue,
      uiValueToNodeValue,
    });

  const { accuracy, srs = defaultSrsCode } = uiValue || {};

  const onValueChange = useCallback(
    (valueNext) => {
      if (!valueNext.srs && singleSrs) {
        // set default SRS
        valueNext.srs = defaultSrsCode;
      }
      updateNodeValue(valueNext);
    },
    [defaultSrsCode, singleSrs, updateNodeValue]
  );

  const onChangeValueField = useCallback(
    (fieldKey) => (val) => {
      onValueChange({ ...uiValue, [fieldKey]: val });
    },
    [onValueChange, uiValue]
  );

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
    [onValueChange, srs]
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

  const performCoordinateConversion = useCallback(
    (uiVal, srsTo) => {
      const { x, y, srs } = uiVal;
      const pointFrom = PointFactory.createInstance({ x, y, srs });
      const pointTo = Points.transform(pointFrom, srsTo, srsIndex);

      const uiValueNext = { ...uiValue, ...pointToUiValue(pointTo) };
      onValueChange(uiValueNext);
    },
    [onValueChange]
  );

  const onChangeSrs = useCallback(
    (val) => {
      // workaround related to onChange callback passed to Dropdown:
      // get uiValue from state otherwise it will use an old value of it
      const uiVal = getUiValueFromState();
      const { x, y, srs } = uiVal;

      if (val === srs) return;

      if (!Objects.isEmpty(x) && !Objects.isEmpty(y)) {
        dispatch(
          ConfirmActions.show({
            messageKey: "dataEntry:coordinate.confirmConvertCoordinate",
            messageParams: { srsFrom: srs, srsTo: val },
            confirmButtonTextKey: "dataEntry:coordinate.convert",
            cancelButtonTextKey: "dataEntry:coordinate.keepXAndY",
            onConfirm: () => performCoordinateConversion(uiVal, val),
            onCancel: () => updateNodeValue({ ...uiVal, srs: val }),
          })
        );
      } else {
        updateNodeValue({ ...uiVal, srs: val });
      }
    },
    [performCoordinateConversion, onChangeValueField]
  );

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
  };
};
