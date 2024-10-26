import { useEffect, useState } from "react";

import {
  LocationWatchingMonitor,
  Modal,
  SelectableList,
  Text,
} from "components";
import { useLocation } from "hooks";

const maxLocations = 3;

export const NodeCoordinateAverageMonitor = (props) => {
  const { onDismiss } = props;

  const [state, setState] = useState({
    locationsFetched: [],
    selectedLocation: null,
  });
  const { locationsFetched, selectedLocation } = state;

  const {
    locationAccuracy,
    locationAccuracyThreshold,
    locationFetched,
    locationWatchElapsedTime,
    locationWatchTimeout,
    pointLatLong,
    startLocationWatch,
    stopLocationWatch,
    wathingLocation,
  } = useLocation();

  const locationsCount = locationsFetched.length;

  useEffect(() => {
    if (!locationFetched) return;

    const locationsCountNext = locationsCount + 1;

    setState((statePrev) => ({
      ...statePrev,
      locationsFetched: [...statePrev.locationsFetched, pointLatLong],
    }));

    if (maxLocations > locationsCountNext) {
      startLocationWatch();
    }
  }, [
    locationFetched,
    locationsCount,
    pointLatLong,
    setState,
    startLocationWatch,
  ]);

  return (
    <Modal
      titleKey="dataEntry:closestSamplingPoint.findingClosestSamplingPoint"
      onDismiss={onDismiss}
    >
      {wathingLocation && (
        <>
          {wathingLocation && (
            <Text textKey="dataEntry:location.gettingCurrentLocation" />
          )}
          <LocationWatchingMonitor
            locationAccuracy={locationAccuracy}
            locationAccuracyThreshold={locationAccuracyThreshold}
            locationWatchElapsedTime={locationWatchElapsedTime}
            locationWatchTimeout={locationWatchTimeout}
            onStart={startLocationWatch}
            onStop={stopLocationWatch}
            watchingLocation={wathingLocation}
          />
          <SelectableList
            itemKeyExtractor={(item) => JSON.stringify(item)}
            itemLabelExtractor={(item) => JSON.stringify(item)}
            items={locationsFetched}
            onChange={(selectedItems) => {
              setState((statePrev) => ({
                ...statePrev,
                selectedLocation: selectedItems[0],
              }));
            }}
            selectedItems={selectedLocation ? [selectedLocation] : []}
          />
        </>
      )}
    </Modal>
  );
};
