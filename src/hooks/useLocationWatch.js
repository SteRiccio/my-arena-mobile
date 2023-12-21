import { useCallback, useRef, useState } from "react";
import * as Location from "expo-location";
import { PointFactory } from "@openforis/arena-core";

import { SettingsSelectors } from "../state/settings";

const locationWatchElapsedTimeIntervalDelay = 1000;
const defaultLocationAccuracyThreshold = 4;
const defaultLocationAccuracyWatchTimeout = 120000; // 2 mins

export const useLocationWatch = ({
  accuracy = Location.Accuracy.Highest,
  distanceInterval = 0.01,
  locationCallback: locationCallbackProp,
  stopOnAccuracyThreshold = true,
  stopOnTimeout = true,
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

  const stopLocationWatch = useCallback(() => {
    locationSubscriptionRef.current?.remove();
    locationSubscriptionRef.current = null;

    clearLocationWatchTimeout();

    setState((statePrev) => ({
      ...statePrev,
      locationWatchElapsedTime: 0,
      watchingLocation: false,
    }));
  }, [clearLocationWatchTimeout]);

  const locationCallback = useCallback(
    (location) => {
      lastLocationRef.current = location; // location could be null when watch timeout is reached

      const { coords } = location ?? {};
      const { latitude, longitude, accuracy: locationAccuracy } = coords ?? {};

      const accuractyThresholdReached =
        locationAccuracy <= locationAccuracyThreshold;
      const timeoutReached =
        stopOnTimeout && locationSubscriptionRef.current === null;
      const thresholdReached = accuractyThresholdReached || timeoutReached;
      if (
        (stopOnAccuracyThreshold && thresholdReached) ||
        (stopOnTimeout && timeoutReached)
      ) {
        stopLocationWatch();
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
    [
      locationCallbackProp,
      locationAccuracyThreshold,
      stopOnAccuracyThreshold,
      stopOnTimeout,
    ]
  );

  const startLocationWatch = useCallback(async () => {
    const foregroundPermission =
      await Location.requestForegroundPermissionsAsync();
    if (!foregroundPermission.granted) {
      return;
    }
    stopLocationWatch();
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

    if (stopOnTimeout) {
      locationAccuracyWatchTimeoutRef.current = setTimeout(() => {
        stopLocationWatch();
        locationCallback(lastLocationRef.current);
      }, locationWatchTimeout);
    }
    setState((statePrev) => ({ ...statePrev, watchingLocation: true }));
  }, [
    locationCallback,
    locationAccuracyThreshold,
    locationWatchTimeout,
    stopOnTimeout,
  ]);

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
