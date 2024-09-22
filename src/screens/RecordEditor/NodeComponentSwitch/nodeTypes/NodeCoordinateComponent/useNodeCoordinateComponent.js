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

import { useLocationWatch } from "hooks";
import { RecordNodes } from "model/utils/RecordNodes";
import { DataEntrySelectors, SurveySelectors, useConfirm } from "state";
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

  const confirm = useConfirm();
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

  const isNodeValueEqual = useCallback(
    (nodeValueA, nodeValueB) => {
      const transformCoordinateValue = (coordVal) => {
        if (!coordVal) return null;
        const includedFields = ["x", "y", "srs", ...includedExtraFields];
        return Object.entries(coordVal).reduce((acc, [key, value]) => {
          if (includedFields.includes(key)) {
            acc[key] = value;
          }
          return acc;
        }, {});
      };
      const coordValA = transformCoordinateValue(nodeValueA);
      const coordValB = transformCoordinateValue(nodeValueB);
      return (
        Objects.isEqual(coordValA, coordValB) ||
        JSON.stringify(coordValA) === JSON.stringify(coordValB) ||
        (Objects.isEmpty(coordValA) && Objects.isEmpty(coordValB))
      );
    },
    [includedExtraFields]
  );

  const { applicable, uiValue, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
    updateDelay: 500,
    nodeValueToUiValue,
    uiValueToNodeValue,
    isNodeValueEqual,
  });

  const {
    accuracy,
    srs = defaultSrsCode,
    x: uiValueX,
    y: uiValueY,
  } = uiValue ?? {};

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
    [nodeDef, onValueChange, srs, srsIndex]
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
  }, [stopLocationWatch]);

  const performCoordinateConversion = useCallback(
    (srsTo) => {
      const { x, y, srs } = uiValue;
      const pointFrom = PointFactory.createInstance({ x, y, srs });
      const pointTo = Points.transform(pointFrom, srsTo, srsIndex);

      const uiValueNext = { ...uiValue, ...pointToUiValue(pointTo) };
      onValueChange(uiValueNext);
    },
    [onValueChange, srsIndex, uiValue]
  );

  const onChangeSrs = useCallback(
    async (srsTo) => {
      // workaround related to onChange callback passed to Dropdown:
      // get uiValue from state otherwise it will use an old value of it
      const { x, y, srs } = uiValue;

      if (srsTo === srs) return;

      if (
        !Objects.isEmpty(x) &&
        !Objects.isEmpty(y) &&
        (await confirm({
          messageKey: "dataEntry:coordinate.confirmConvertCoordinate",
          messageParams: { srsFrom: srs, srsTo },
          confirmButtonTextKey: "dataEntry:coordinate.convert",
          cancelButtonTextKey: "dataEntry:coordinate.keepXAndY",
        }))
      ) {
        performCoordinateConversion(srsTo);
      } else {
        updateNodeValue({ ...uiValue, srs: srsTo });
      }
    },
    [confirm, performCoordinateConversion, uiValue, updateNodeValue]
  );

  const onStartGpsPress = useCallback(async () => {
    if (
      Objects.isEmpty(uiValueX) ||
      Objects.isEmpty(uiValueY) ||
      (await confirm({
        messageKey: "dataEntry:coordinate.overwriteConfirmMessage",
      }))
    ) {
      await startLocationWatch();
    }
  }, [confirm, startLocationWatch, uiValueX, uiValueY]);

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
    [nodeDef, srs, srsIndex, onValueChange]
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
