import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Image } from "react-native";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { useAssets } from "expo-asset";

import { VView } from "components/VView";
import { Text } from "components/Text";
import { View } from "components/View";

const { height, width } = Dimensions.get("window");

const targetPoint = { x: 12.49228, y: 41.89119 };

const magnetometerDataToAngle = (magnetometer) => {
  let angle = 0;
  if (magnetometer) {
    let { x, y } = magnetometer;
    const rads = Math.atan2(y, x);
    if (rads >= 0) {
      angle = rads * (180 / Math.PI);
    } else {
      angle = (rads + 2 * Math.PI) * (180 / Math.PI);
    }
  }
  return Math.round(angle);
};

const _degree = (magnetometer) => {
  return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
};

export const LocationNavigator = (props) => {
  const locationSubscriptionRef = useRef(null);
  const magnetometerSubscriptionRef = useRef(null);
  const [compassBg] = useAssets(
    require("../../../../../../assets/compass_bg.png")
  );

  const [state, setState] = useState({ heading: 0, angleToTarget: 0 });
  const { heading, angleToTarget } = state;

  const updateState = useCallback(
    ({ heading: headingParam, angleToTarget: angleToTargetNew }) => {
      let changed = false;
      let headingNext = heading;
      if (headingParam !== undefined && headingParam !== heading) {
        headingNext = headingParam;
        changed = true;
      }
      let angleNext = angleToTarget;
      if (
        angleToTargetNew !== undefined &&
        angleToTargetNew !== angleToTarget
      ) {
        angleNext = angleToTargetNew;
        changed = true;
      }
      if (changed) {
        setState({ heading: headingNext, angleToTarget: angleNext });
      }
    },
    [heading, angleToTarget]
  );

  useEffect(() => {
    magnetometerSubscriptionRef.current = Magnetometer.addListener((data) => {
      updateState({ heading: magnetometerDataToAngle(data) });
    });
    const startWatchLocation = async () => {
      locationSubscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 0.1,
        },
        (location) => {
          const { coords } = location;
          const { latitude: currentLocationY, longitude: currentLocationX } =
            coords;
          const angleRads = Math.atan2(
            currentLocationY - targetPoint.y,
            currentLocationX - targetPoint.x
          );
          const angleToTarget = angleRads * (180 / Math.PI);
          updateState({ angleToTarget });
        }
      );
    };
    startWatchLocation();

    return () => {
      magnetometerSubscriptionRef.current?.remove();
      locationSubscriptionRef.current?.remove();
    };
  }, []);

  return (
    <VView>
      <View>
        <Text
          style={{
            color: "#fff",
            fontSize: height / 27,
            width: width,
            position: "absolute",
            textAlign: "center",
            top: "50%",
            left: 0,
          }}
        >
          {_degree(heading)}°
        </Text>
        <Image
          source={compassBg}
          style={{
            height: width - 80,
            justifyContent: "center",
            alignItems: "center",
            resizeMode: "contain",
            transform: [{ rotate: 360 - heading + "deg" }],
          }}
        />
      </View>
    </VView>
  );
};
