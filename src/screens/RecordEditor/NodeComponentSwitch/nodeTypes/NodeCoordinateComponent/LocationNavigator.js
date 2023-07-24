import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Image } from "react-native";
import { Modal, Portal } from "react-native-paper";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { useAssets } from "expo-asset";

import { Objects, PointFactory, Points } from "@openforis/arena-core";

import { Button, HView, Text, View, VView } from "components";
import { SurveySelectors } from "state/survey";

import styles from "./locationNavigatorStyles";

const { height, width } = Dimensions.get("window");

const targetLocationMarkerHeight = height / 26;
const targetLocationBoxWidth = width;
const compassImageSize =
  targetLocationBoxWidth - targetLocationMarkerHeight * 2;

const radsToDegrees = (rads) =>
  rads >= 0 ? rads * (180 / Math.PI) : (rads + 2 * Math.PI) * (180 / Math.PI);

const magnetometerDataToAngle = (magnetometer) => {
  let angle = 0;
  if (magnetometer) {
    const { x, y } = magnetometer;
    const rads = Math.atan2(y, x);
    angle = radsToDegrees(rads);
  }
  return Math.round(angle);
};

const _degree = (magnetometer) => {
  return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
};

const formatNumber = (num, decimals) =>
  Objects.isEmpty(num) ? "-" : num.toFixed(decimals);

export const LocationNavigator = (props) => {
  const { targetLocation, onDismiss, onUseCurrentLocation } = props;

  const srsIndex = SurveySelectors.useCurrentSurveySrsIndex();

  const locationSubscriptionRef = useRef(null);
  const magnetometerSubscriptionRef = useRef(null);
  const [[compassBg, compassPointer, cicleGreen] = []] = useAssets([
    require("../../../../../../assets/compass_bg.png"),
    require("../../../../../../assets/compass_pointer.png"),
    require("../../../../../../assets/circle_green.png"),
  ]);

  const [state, setState] = useState({
    currentLocation: null,
    heading: 0,
    angleToTarget: 0,
    accuracy: 0,
    distance: 0,
  });
  const { currentLocation, heading, angleToTarget, accuracy, distance } = state;

  const targetLocationBoxWidthAdjusted =
    targetLocationBoxWidth * (distance < 10 ? distance / 10 : 1);

  const updateState = useCallback(
    (params) => {
      const stateNext = { ...state, ...params };
      if (!Objects.isEqual(state, stateNext)) {
        setState(stateNext);
      }
    },
    [state]
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
            accuracy: accuracyNew,
          } = coords;
          const angleRads = Math.atan2(
            currentLocationY - targetLocation.y,
            currentLocationX - targetLocation.x
          );
          const angleToTargetNew = radsToDegrees(angleRads);
          const currentLocationPoint = PointFactory.createInstance({
            x: currentLocationX,
            y: currentLocationX,
          });
          const distanceNew = Points.distance(
            currentLocationPoint,
            targetLocation,
            srsIndex
          );
          updateState({
            currentLocation: location,
            angleToTarget: angleToTargetNew,
            accuracy: accuracyNew,
            distance: distanceNew,
          });
        }
      );
    };
    startWatchLocation();

    return () => {
      magnetometerSubscriptionRef.current?.remove();
      locationSubscriptionRef.current?.remove();
    };
  }, [srsIndex, targetLocation, updateState]);

  const onUseCurrentLocationPress = useCallback(() => {
    onUseCurrentLocation(currentLocation);
    onDismiss();
  }, [currentLocation, onDismiss, onUseCurrentLocation]);

  return (
    <Portal>
      <Modal visible onDismiss={onDismiss}>
        <VView>
          <VView style={{ marginVertical: 40 }}>
            {/* <Image
        source={compassPointer}
        style={{
          alignSelf: "center",
          height: height / 26,
          resizeMode: "contain",
        }}
      /> */}
            <View
              style={{
                height: targetLocationBoxWidth,
                width: targetLocationBoxWidth,
              }}
            >
              <View
                style={{
                  height: compassImageSize,
                  width: compassImageSize,
                  position: "absolute",
                  left: targetLocationMarkerHeight,
                  top: targetLocationMarkerHeight,
                }}
              >
                <Image
                  source={compassBg}
                  style={{
                    height: compassImageSize,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    resizeMode: "contain",
                    transform: [{ rotate: 360 - heading + "deg" }],
                  }}
                />
                <Text
                  variant="displaySmall"
                  style={{
                    width: "100%",
                    position: "absolute",
                    textAlign: "center",
                    top: "45%",
                  }}
                >
                  {_degree(heading)}°
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "transparent",
                  width: targetLocationBoxWidthAdjusted,
                  height: targetLocationBoxWidthAdjusted,
                  position: "absolute",
                  top:
                    (targetLocationBoxWidth - targetLocationBoxWidthAdjusted) /
                    2,
                  left:
                    (targetLocationBoxWidth - targetLocationBoxWidthAdjusted) /
                    2,
                  resizeMode: "contain",
                  transform: [
                    { rotate: 360 - (heading + angleToTarget) + "deg" },
                  ],
                }}
              >
                <Image
                  source={cicleGreen}
                  style={{
                    alignSelf: "center",
                    height: targetLocationMarkerHeight,
                    resizeMode: "contain",
                  }}
                />
              </View>
            </View>
            <HView style={{ justifyContent: "space-between" }}>
              <HView>
                <Text textKey="accuracy" />
                <Text>{formatNumber(accuracy)}m</Text>
              </HView>
              <HView>
                <Text textKey="distance" />
                <Text>{formatNumber(distance)}m</Text>
              </HView>
              <HView>
                <Text textKey="angle" />
                <Text> {formatNumber(angleToTarget)} &deg;</Text>
              </HView>
            </HView>
          </VView>
          <HView style={styles.bottomBar}>
            <Button onPress={onDismiss} textKey="common:close" />
            <Button
              onPress={onUseCurrentLocationPress}
              textKey="dataEntry:coordinate.useCurrentLocation"
            />
          </HView>
        </VView>
      </Modal>
    </Portal>
  );
};
