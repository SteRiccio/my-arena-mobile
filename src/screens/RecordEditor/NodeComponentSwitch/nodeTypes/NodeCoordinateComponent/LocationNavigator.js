import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Image } from "react-native";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { useAssets } from "expo-asset";

import { VView } from "components/VView";
import { Text } from "components/Text";
import { View } from "components/View";
import { Objects } from "@openforis/arena-core";
import { HView } from "components/HView";

const { height, width } = Dimensions.get("window");

const targetPoint = { x: 12.49228, y: 41.89119 };

const magnetometerDataToAngle = (magnetometer) => {
  let angle = 0;
  if (magnetometer) {
    const { x, y } = magnetometer;
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
  const [[compassBg, compassPointer] = []] = useAssets([
    require("../../../../../../assets/compass_bg.png"),
    require("../../../../../../assets/compass_pointer.png"),
  ]);

  const [state, setState] = useState({
    heading: 0,
    angleToTarget: 0,
    accuracy: 0,
    distance: 0,
  });
  const { heading, angleToTarget, accuracy, distance } = state;

  const updateState = useCallback(
    (params) => {
      const statePrev = { heading, angleToTarget, accuracy };
      const stateNext = { ...statePrev, ...params };
      if (!Objects.isEqual(statePrev, stateNext)) {
        setState(stateNext);
      }
    },
    [heading, angleToTarget, accuracy]
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
          const {
            latitude: currentLocationY,
            longitude: currentLocationX,
            accuracy,
          } = coords;
          const angleRads = Math.atan2(
            currentLocationY - targetPoint.y,
            currentLocationX - targetPoint.x
          );
          const angleToTarget = angleRads * (180 / Math.PI);
          updateState({ angleToTarget, accuracy });
        }
      );
    };
    startWatchLocation();

    return () => {
      magnetometerSubscriptionRef.current?.remove();
      locationSubscriptionRef.current?.remove();
    };
  }, [updateState]);

  return (
    <VView>
      <Image
        source={compassPointer}
        style={{
          alignSelf: "center",
          height: height / 26,
          resizeMode: "contain",
        }}
      />
      <View>
        <Image
          source={compassBg}
          style={{
            height: width - 80,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            resizeMode: "contain",
            transform: [{ rotate: 360 - heading + "deg" }],
          }}
        />
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

        <View
          style={{
            backgroundColor: "transparent",
            width: width - 40,
            height: width - 40,
            position: "absolute",
            top: -20,
            left: 20,
            resizeMode: "contain",
            transform: [{ rotate: 360 - (heading + angleToTarget) + "deg" }],
          }}
        >
          <Image
            source={compassPointer}
            style={{
              alignSelf: "center",
              height: height / 26,
              resizeMode: "contain",
            }}
          />
        </View>
      </View>
      <HView style={{ justifyContent: "space-between" }}>
        <HView>
          <Text textKey="accuracy" />
          <Text>{accuracy}m</Text>
        </HView>
        <HView>
          <Text textKey="distance" />
          <Text>{distance}m</Text>
        </HView>
      </HView>
    </VView>
  );
};
