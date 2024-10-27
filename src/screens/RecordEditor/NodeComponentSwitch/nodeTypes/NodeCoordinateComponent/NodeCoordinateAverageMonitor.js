import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { UUIDs } from "@openforis/arena-core";

import {
  LocationWatchingMonitor,
  Modal,
  SelectableList,
  Text,
} from "components";
import { useLocation } from "hooks";

const maxLocations = 3;

const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;
const radiansToDegrees = (radians) => (radians * 180) / Math.PI;

const averageGeolocation = (coords) => {
  if (coords.length === 1) {
    return coords[0];
  }

  let x = 0.0;
  let y = 0.0;
  let z = 0.0;

  coords.forEach((coord) => {
    let latitudeRads = degreesToRadians(coord.latitude);
    let longitudeRads = degreesToRadians(coord.longitude);

    x += Math.cos(latitudeRads) * Math.cos(longitudeRads);
    y += Math.cos(latitudeRads) * Math.sin(longitudeRads);
    z += Math.sin(latitudeRads);
  });

  const total = coords.length;

  x = x / total;
  y = y / total;
  z = z / total;

  const centralLongitude = Math.atan2(y, x);
  const centralSquareRoot = Math.sqrt(x * x + y * y);
  const centralLatitude = Math.atan2(z, centralSquareRoot);

  return {
    x: radiansToDegrees(centralLongitude),
    y: radiansToDegrees(centralLatitude),
  };
};

export const NodeCoordinateAverageMonitor = (props) => {
  const { onDismiss } = props;

  const [state, setState] = useState({
    averageLocation: null,
    locationsFetched: [],
    selectedLocation: null,
  });
  const { averageLocation, locationsFetched, selectedLocation } = state;

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
    if (!locationFetched || locationsCount >= maxLocations) return;

    const locationsCountNext = locationsCount + 1;

    setState((statePrev) => {
      const location = { ...pointLatLong, uuid: UUIDs.v4() };
      const locationsNext = [...statePrev.locationsFetched, location];
      const averageLocation = averageGeolocation(locationsNext);
      return {
        ...statePrev,
        averageLocation,
        locationsFetched: locationsNext,
      };
    });

    if (maxLocations > locationsCountNext) {
      startLocationWatch();
    }
  }, [locationFetched, locationsCount, pointLatLong, startLocationWatch]);

  return (
    <Modal
      titleKey="dataEntry:location.gettingCurrentLocationWithAverage"
      onDismiss={onDismiss}
    >
      {wathingLocation && (
        <>
          <Text textKey="dataEntry:location.gettingCurrentLocation" />
          <LocationWatchingMonitor
            locationAccuracy={locationAccuracy}
            locationAccuracyThreshold={locationAccuracyThreshold}
            locationWatchElapsedTime={locationWatchElapsedTime}
            locationWatchTimeout={locationWatchTimeout}
            onStart={startLocationWatch}
            onStop={stopLocationWatch}
            watchingLocation={wathingLocation}
          />
        </>
      )}
      <SelectableList
        itemKeyExtractor={(item) => item?.uuid}
        itemLabelExtractor={(item) => JSON.stringify(item)}
        items={locationsFetched}
        onChange={(selectedItems) => {
          setState((statePrev) => ({
            ...statePrev,
            selectedLocation: selectedItems[0],
          }));
        }}
        onItemDelete={({ item }) =>
          setState((statePrev) => ({
            ...statePrev,
            locationsFetched: statePrev.locationsFetched.filter(
              (location) => location.uuid !== item.uuid
            ),
          }))
        }
        selectedItems={selectedLocation ? [selectedLocation] : []}
      />
      {locationsCount === maxLocations && (
        <>
          <Text textKey="dataEntry:location.averageLocation">
            {JSON.stringify(averageLocation)}
          </Text>
        </>
      )}
    </Modal>
  );
};

NodeCoordinateAverageMonitor.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};
