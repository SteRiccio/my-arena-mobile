import PropTypes from "prop-types";

import { FieldSet } from "../FieldSet";
import { Button } from "../Button";
import { HView } from "../HView";
import { Text } from "../Text";
import { View } from "../View";
import { VView } from "../VView";
import { AccuracyProgressBar } from "./AccuracyProgressBar";
import { ElapsedTimeProgressBar } from "./ElapsedTimeProgressBar";

export const LocationWatchingMonitor = (props) => {
  const {
    locationAccuracy,
    locationAccuracyThreshold,
    locationWatchElapsedTime,
    locationWatchTimeout,
    onStart,
    onStop,
    watchingLocation,
  } = props;

  const locationAccuracyFormatted =
    typeof locationAccuracy === "string"
      ? locationAccuracy
      : locationAccuracy?.toFixed?.(2);

  return (
    <VView style={{ gap: 4 }}>
      {watchingLocation && (
        <>
          <FieldSet headerKey="dataEntry:coordinate.accuracy">
            <HView>
              <View style={{ width: "80%" }}>
                <AccuracyProgressBar
                  accuracy={locationAccuracy}
                  accuracyThreshold={locationAccuracyThreshold}
                />
              </View>
              <Text>{locationAccuracyFormatted} m</Text>
            </HView>
          </FieldSet>
          <ElapsedTimeProgressBar
            elapsedTime={locationWatchElapsedTime}
            elapsedTimeThreshold={locationWatchTimeout}
          />
        </>
      )}
      {!watchingLocation && (
        <Button
          icon="play"
          onPress={onStart}
          textKey="dataEntry:coordinate.startGPS"
        />
      )}
      {watchingLocation && (
        <Button
          icon="stop"
          onPress={onStop}
          textKey="dataEntry:coordinate.stopGPS"
        />
      )}
    </VView>
  );
};

LocationWatchingMonitor.propTypes = {
  locationAccuracy: PropTypes.number.isRequired,
  locationAccuracyThreshold: PropTypes.number.isRequired,
  locationWatchElapsedTime: PropTypes.number.isRequired,
  locationWatchTimeout: PropTypes.number.isRequired,
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  watchingLocation: PropTypes.bool.isRequired,
};
