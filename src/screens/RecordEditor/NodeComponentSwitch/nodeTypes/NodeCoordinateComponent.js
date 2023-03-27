import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

import { Button, HView, Text, TextInput, VView } from "../../../../components";
import { SurveySelectors } from "../../../../state/survey/selectors";
import { useNodeComponentLocalState } from "../../nodeComponentLocalState";
import { SrsDropdown } from "../../SrsDropdown";
import styles from "./nodeCoordinateComponentStyles";
import { PointFactory, Points, SRSs } from "@openforis/arena-core";

export const NodeCoordinateComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeCoordinateComponent for ${nodeDef.props.name}`);
  }

  const [state, setState] = useState({
    watchingLocation: false,
  });

  const locationSubscritionRef = useRef(null);

  const { watchingLocation } = state;

  const { applicable, value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const survey = SurveySelectors.useCurrentSurvey();
  const srss = survey.props.srs;

  const editable = !nodeDef.props.readOnly;

  const { accuracy, x, y, srsId = srss[0].code } = value || {};

  const xTextValue = Objects.isEmpty(x) ? "" : String(x);
  const yTextValue = Objects.isEmpty(y) ? "" : String(y);

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
    if (foregroundPermission.granted) {
      locationSubscritionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },
        (location) => {
          const { coords } = location;
          const pointLatLong = PointFactory.createInstance({
            x: coords.longitude,
            y: coords.latitude,
            srs: "4326",
          });
          const point = Points.transform(pointLatLong, srsId);

          onValueChange({
            x: point.x,
            y: point.y,
            srsId: point.srs,
            accuracy: coords.accuracy,
          });
        }
      );
      setState((statePrev) => ({ ...statePrev, watchingLocation: true }));
    }
  }, []);

  const onStopGpsPress = useCallback(() => {
    stopGps();
    setState((statePrev) => ({ ...statePrev, watchingLocation: false }));
  });

  return (
    <VView>
      <HView>
        <Text textKey="X" />
        <TextInput
          editable={editable}
          keyboardType="numeric"
          style={[
            styles.textInput,
            ...(applicable ? [] : [styles.textInputNotApplicable]),
          ]}
          onChange={onChangeX}
          value={xTextValue}
        />
      </HView>
      <HView>
        <Text textKey="Y" />
        <TextInput
          editable={editable}
          keyboardType="numeric"
          style={[
            styles.textInput,
            ...(applicable ? [] : [styles.textInputNotApplicable]),
          ]}
          onChange={onChangeY}
          value={yTextValue}
        />
      </HView>
      <HView>
        <Text textKey="SRS" />
        <SrsDropdown onChange={onChangeSrs} value={srsId} />
      </HView>
      <HView>
        <Text textKey="Accuracy" />
        <Text textKey={accuracy} />
      </HView>
      {!watchingLocation && (
        <Button onPress={onStartGpsPress}>Start GPS</Button>
      )}
      {watchingLocation && <Button onPress={onStopGpsPress}>Stop GPS</Button>}
    </VView>
  );
};
