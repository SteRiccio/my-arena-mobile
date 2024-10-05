import { Numbers } from "@openforis/arena-core";
import { Magnetometer } from "expo-sensors";
import { useCallback, useEffect, useRef, useState } from "react";
import { AverageAnglePicker } from "utils/AverageAnglePicker";

const radsToDegrees = (rads) =>
  (rads >= 0 ? rads : rads + 2 * Math.PI) * (180 / Math.PI);

const magnetometerDataToAngle = (magnetometer) => {
  let angle = 0;
  if (magnetometer) {
    const { x, y } = magnetometer;
    const rads = Math.atan2(y, x);
    angle = radsToDegrees(rads);
  }
  // Match the device top with 0° degree angle (by default 0° starts from the right of the device)
  let result = Numbers.roundToPrecision(angle, 1) - 90;
  result = Numbers.absMod(360)(result);
  return result;
};

const averageAnglePicker = new AverageAnglePicker();

export const useMagnetometerHeading = () => {
  const magnetometerSubscriptionRef = useRef(null);
  const lastMagnetometerAngleRef = useRef(0);

  const [magnetometerAvailable, setMagnetometerAvailable] = useState(true);
  const [heading, setHeading] = useState(0);

  const onMagnetometerData = useCallback((data) => {
    const prevMagnetometerAngle = lastMagnetometerAngleRef.current;
    const magnetometerAngle = magnetometerDataToAngle(data);
    let avgAngle = averageAnglePicker.push(magnetometerAngle);
    avgAngle = Numbers.absMod(360)(avgAngle);

    if (avgAngle !== prevMagnetometerAngle) {
      setHeading(avgAngle);
    }
    lastMagnetometerAngleRef.current = avgAngle;
  }, []);

  const subscribeToMagnetometerData = useCallback(async () => {
    try {
      const available = await Magnetometer.isAvailableAsync();
      if (available) {
        magnetometerSubscriptionRef.current =
          Magnetometer.addListener(onMagnetometerData);
      } else {
        setMagnetometerAvailable(false);
      }
    } catch (_error) {
      setMagnetometerAvailable(false);
    }
  }, [onMagnetometerData, setMagnetometerAvailable]);

  useEffect(() => {
    subscribeToMagnetometerData();
    return () => {
      magnetometerSubscriptionRef.current?.remove();
    };
  }, [subscribeToMagnetometerData]);

  return { magnetometerAvailable, heading };
};
