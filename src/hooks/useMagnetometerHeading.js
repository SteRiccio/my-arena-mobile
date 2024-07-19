import { Magnetometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

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
  let result = Math.round(angle) - 90;
  if (result < 0) {
    result += 360;
  }
  return result;
};

export const useMagnetometerHeading = () => {
  const magnetometerSubscriptionRef = useRef(null);
  const [state, setState] = useState({
    magnetometerAvailable: true,
    heading: 0,
  });

  const { magnetometerAvailable, heading } = state;

  useEffect(() => {
    Magnetometer.isAvailableAsync()
      .then((available) => {
        if (available) {
          magnetometerSubscriptionRef.current = Magnetometer.addListener(
            (data) => {
              setState((statePrev) => ({
                ...statePrev,
                heading: magnetometerDataToAngle(data),
              }));
            }
          );
        }
        setState((statePrev) => ({
          ...statePrev,
          magnetometerAvailable: available,
        }));
      })
      .catch(() => {
        setState((statePrev) => ({
          ...statePrev,
          magnetometerAvailable: false,
        }));
      });

    return () => {
      magnetometerSubscriptionRef.current?.remove();
    };
  }, []);

  return { magnetometerAvailable, heading };
};
