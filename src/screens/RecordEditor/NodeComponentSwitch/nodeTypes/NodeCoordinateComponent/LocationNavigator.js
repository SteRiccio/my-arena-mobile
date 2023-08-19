import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Image } from "react-native";
import { Modal, Portal, useTheme } from "react-native-paper";
import * as Location from "expo-location";

import { Objects, PointFactory, Points } from "@openforis/arena-core";

import { useTranslation } from "localization";
import { useMagnetometerHeading } from "hooks";
import { Button, HView, Text, View, VView } from "components";
import { SurveySelectors } from "state/survey";

import styles from "./locationNavigatorStyles";

const compassBgBlack = require(`../../../../../../assets/compass_bg_black.png`);
const compassBgWhite = require(`../../../../../../assets/compass_bg_white.png`);
const arrowUpGreen = require("../../../../../../assets/arrow_up_green.png");
const arrowUpOrange = require("../../../../../../assets/arrow_up_orange.png");
const arrowUpRed = require("../../../../../../assets/arrow_up_red.png");
const circleGreen = require("../../../../../../assets/circle_green.png");

const arrowToTargetVisibleDistanceThreshold = 30;

const { height, width } = Dimensions.get("window");

const compassImageSize = width - 40;
const arrowToTargetHeight = compassImageSize * 0.7;
const targetLocationBoxWidth = compassImageSize * 0.7;
const targetLocationMarkerHeight = height / 26;

const getArrowImageByAngle = (angle) => {
  if (angle > 45) return arrowUpRed;
  if (angle > 20) return arrowUpOrange;
  return arrowUpGreen;
};

const radsToDegrees = (rads) =>
  (rads >= 0 ? rads : rads + 2 * Math.PI) * (180 / Math.PI);

const formatNumber = (num, decimals = 2) =>
  Objects.isEmpty(num) ? "-" : num.toFixed(decimals);

const FormItem = ({ labelKey, children }) => {
  const { t } = useTranslation();
  const label = `${t(labelKey)}:`;
  return (
    <HView style={{ alignItems: "baseline" }}>
      <Text variant="labelLarge">{label}</Text>
      <Text variant="bodyLarge">{children}</Text>
    </HView>
  );
};

export const LocationNavigator = (props) => {
  const { targetPoint, onDismiss, onUseCurrentLocation } = props;

  const srsIndex = SurveySelectors.useCurrentSurveySrsIndex();

  const locationSubscriptionRef = useRef(null);

  const theme = useTheme();

  const compassBg = theme.dark ? compassBgWhite : compassBgBlack;

  const [state, setState] = useState({
    currentLocation: null,
    angleToTarget: 0,
    accuracy: 0,
    distance: 0,
  });

  const { heading, magnetometerAvailable } = useMagnetometerHeading();

  const { currentLocation, angleToTarget, accuracy, distance } = state;
  const currentLocationX = currentLocation?.coords?.longitude;
  const currentLocationY = currentLocation?.coords?.latitude;

  const arrowToTargetVisible =
    distance >= arrowToTargetVisibleDistanceThreshold;

  const targetLocationBoxWidthAdjusted =
    targetLocationBoxWidth *
    (arrowToTargetVisible
      ? 1
      : distance / arrowToTargetVisibleDistanceThreshold);

  const targetLocationBoxMargin =
    (compassImageSize -
      targetLocationBoxWidth +
      (targetLocationBoxWidth - targetLocationBoxWidthAdjusted)) /
    2;

  let angleToTargetDifference = angleToTarget - heading;
  if (angleToTargetDifference < 0) angleToTargetDifference += 360;

  const arrowToTargetSource = getArrowImageByAngle(angleToTargetDifference);

  const updateState = (params) => {
    setState((statePrev) => ({ ...statePrev, ...params }));
  };

  useEffect(() => {
    const startWatchLocation = async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) return;

      locationSubscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 0.2,
        },
        (location) => {
          const { coords } = location;
          const { latitude: y, longitude: x, accuracy: accuracyNew } = coords;
          const angleRads = Math.atan2(y - targetPoint.y, x - targetPoint.x);
          const angleToTargetNew = (radsToDegrees(angleRads) + 90) % 360;
          const currentLocationPoint = PointFactory.createInstance({ x, y });
          const distanceNew = Points.distance(
            currentLocationPoint,
            targetPoint,
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
      locationSubscriptionRef.current?.remove();
    };
  }, []);

  const onUseCurrentLocationPress = useCallback(() => {
    onUseCurrentLocation(currentLocation);
    onDismiss();
  }, [currentLocation, onDismiss, onUseCurrentLocation]);

  return (
    <Portal>
      <Modal visible onDismiss={onDismiss}>
        <VView style={styles.container}>
          <Text
            textKey="dataEntry:coordinate.navigateToTarget"
            variant="titleLarge"
          />
          {!magnetometerAvailable && (
            <Text
              textKey="dataEntry:coordinate.magnetometerNotAvailable"
              variant="labelMedium"
            />
          )}
          <VView style={styles.compassContainer}>
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
                height: compassImageSize,
                width: compassImageSize,
              }}
            >
              <Image
                source={compassBg}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: compassImageSize,
                  width: compassImageSize,
                  resizeMode: "contain",
                  transform: [{ rotate: `${360 - heading} deg` }],
                }}
              />
              {arrowToTargetVisible && (
                <Image
                  source={arrowToTargetSource}
                  style={{
                    position: "absolute",
                    top: (compassImageSize - arrowToTargetHeight) / 2,
                    height: arrowToTargetHeight,
                    transform: [{ rotate: angleToTargetDifference + "deg" }],
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                />
              )}
              {!arrowToTargetVisible && (
                <View
                  style={{
                    backgroundColor: "transparent",
                    width: targetLocationBoxWidthAdjusted,
                    height: targetLocationBoxWidthAdjusted,
                    position: "absolute",
                    top: targetLocationBoxMargin,
                    left: targetLocationBoxMargin,
                    transform: [{ rotate: angleToTargetDifference + "deg" }],
                  }}
                >
                  <Image
                    source={circleGreen}
                    style={{
                      alignSelf: "center",
                      height: targetLocationMarkerHeight,
                      resizeMode: "contain",
                    }}
                  />
                </View>
              )}
            </View>

            <HView style={{ justifyContent: "space-between" }}>
              <FormItem labelKey="dataEntry:coordinate.accuracy">
                {formatNumber(accuracy)}m
              </FormItem>
              <FormItem labelKey="dataEntry:coordinate.distance">
                {formatNumber(distance)}m
              </FormItem>
            </HView>
            <HView style={{ justifyContent: "space-between" }}>
              <FormItem labelKey="dataEntry:coordinate.heading">
                {formatNumber(heading, 0)}&deg;
              </FormItem>
              <FormItem labelKey="dataEntry:coordinate.angleToTargetLocation">
                {formatNumber(angleToTarget, 0)}
                &deg;
              </FormItem>
            </HView>
            <FormItem labelKey="dataEntry:coordinate.currentLocation">
              {formatNumber(currentLocationX, 5)},
              {formatNumber(currentLocationY, 5)}
            </FormItem>
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
