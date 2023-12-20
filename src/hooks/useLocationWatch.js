import { useCallback, useRef, useState } from "react";
import * as Location from "expo-location";
import { PointFactory } from "@openforis/arena-core";

import { SettingsSelectors } from "state";

const locationWatchElapsedTimeIntervalDelay = 1000;
const defaultLocationAccuracyThreshold = 4;
const defaultLocationAccuracyWatchTimeout = 120000; // 2 mins

export const useLocationWatch = ({
  accuracy = Location.Accuracy.Highest,
  distanceInterval = 0.01,
  locationCallback: locationCallbackProp,
}) => {
  const lastLocationRef = useRef(null);
  const locationSubscriptionRef = useRef(null);
  const locationAccuracyWatchTimeoutRef = useRef(null);
  const locationWatchIntervalRef = useRef(null);

  const settings = SettingsSelectors.useSettings();
  const {
    locationAccuracyThreshold = defaultLocationAccuracyThreshold,
    locationAccuracyWatchTimeout: locationAccuracyWatchTimeoutSetting, // in seconds
  } = settings;

  const locationWatchTimeout = locationAccuracyWatchTimeoutSetting
    ? locationAccuracyWatchTimeoutSetting * 1000
    : defaultLocationAccuracyWatchTimeout; // in ms

  const [state, setState] = useState({
    watchingLocation: false,
    locationWatchElapsedTime: 0,
    locationWatchProgress: 0,
  });

  const { locationWatchElapsedTime, locationWatchProgress, watchingLocation } =
    state;

  const clearLocationWatchTimeout = useCallback(() => {
    if (locationWatchIntervalRef.current) {
      clearInterval(locationWatchIntervalRef.current);
      locationWatchIntervalRef.current = null;
    }
    if (locationAccuracyWatchTimeoutRef.current) {
      clearTimeout(locationAccuracyWatchTimeoutRef.current);
      locationAccuracyWatchTimeoutRef.current = null;
    }
  }, []);

  const _stopLocationWatch = useCallback(() => {
    locationSubscriptionRef.current?.remove();
    locationSubscriptionRef.current = null;

    clearLocationWatchTimeout();

    setState((statePrev) => ({
      ...statePrev,
      locationWatchElapsedTime: 0,
      watchingLocation: false,
    }));
  }, [clearLocationWatchTimeout]);

  const stopLocationWatch = useCallback(() => {
    _stopLocationWatch();
    locationCallback(lastLocationRef.current);
  }, [_stopLocationWatch]);

  const locationCallback = useCallback(
    (location) => {
      lastLocationRef.current = location; // location could be null when watch timeout is reached

      const { coords } = location ?? {};
      const { latitude, longitude, accuracy: locationAccuracy } = coords ?? {};

      const thresholdReached =
        locationAccuracy <= locationAccuracyThreshold ||
        locationSubscriptionRef.current === null;
      if (thresholdReached) {
        _stopLocationWatch();
      }
      const pointLatLong = location
        ? PointFactory.createInstance({
            x: longitude,
            y: latitude,
          })
        : null;

      locationCallbackProp({
        location,
        locationAccuracy,
        pointLatLong,
        thresholdReached,
      });
    },
    [locationCallbackProp, locationAccuracyThreshold]
  );

  const startLocationWatch = useCallback(async () => {
    const foregroundPermission =
      await Location.requestForegroundPermissionsAsync();
    if (!foregroundPermission.granted) {
      return;
    }
    _stopLocationWatch();
    locationSubscriptionRef.current = await Location.watchPositionAsync(
      { accuracy, distanceInterval },
      locationCallback
    );
    locationWatchIntervalRef.current = setInterval(
      () => {
        setState((statePrev) => {
          const elapsedTimeNext =
            statePrev.locationWatchElapsedTime +
            locationWatchElapsedTimeIntervalDelay;
          return {
            ...statePrev,
            locationWatchElapsedTime: elapsedTimeNext,
            locationWatchProgress: elapsedTimeNext / locationWatchTimeout,
          };
        });
      },
      locationWatchElapsedTimeIntervalDelay,
      locationWatchTimeout
    );

    locationAccuracyWatchTimeoutRef.current = setTimeout(() => {
      stopLocationWatch();
    }, locationWatchTimeout);

    setState((statePrev) => ({ ...statePrev, watchingLocation: true }));
  }, [locationCallback, locationAccuracyThreshold, locationWatchTimeout]);

  return {
    locationAccuracyThreshold,
    locationWatchElapsedTime,
    locationWatchProgress,
    locationWatchTimeout,
    startLocationWatch,
    stopLocationWatch,
    watchingLocation,
  };
};
