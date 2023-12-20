import { Modal, Portal } from "react-native-paper";

import { useCallback, useEffect, useState } from "react";

import { CategoryItems, Objects, Points } from "@openforis/arena-core";

import { Button, FieldSet, FormItem, Text, VView } from "components";
import { SurveySelectors } from "state";
import { useLocation } from "hooks/useLocation";
import { LocationWatchingMonitor } from "components/LocationWatchingMonitor";
import { SelectableList } from "components/SelectableListWithFilter/SelectableList";

export const NodeCodeFindClosestSamplingPointDialog = ({
  itemLabelFunction,
  items,
  nodeDef,
  onDismiss,
  onDone,
  parentNodeUuid,
}) => {
  const srsIndex = SurveySelectors.useCurrentSurveySrsIndex();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

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

  const [state, setState] = useState({
    findingMinDistanceItems: false,
    minDistance: NaN,
    minDistanceItems: null,
  });

  const { findingMinDistanceItems, minDistance, minDistanceItems } = state;

  const findItemsWithMinDistance = useCallback(() => {
    let minDistanceItems = [];
    let minDistance = null;

    items.forEach((item) => {
      const itemLocation = item?.props?.extra?.location;
      if (itemLocation) {
        const itemLocationPoint = Points.parse(itemLocation);
        const distance = Points.distance(
          pointLatLong,
          itemLocationPoint,
          srsIndex
        );
        if (Objects.isEmpty(minDistance) || distance < minDistance) {
          minDistance = distance;
          minDistanceItems = [item];
        } else if (distance === minDistance) {
          minDistanceItems.push(item);
        }
      }
    });
    return {
      minDistance,
      minDistanceItems,
    };
  }, [pointLatLong, srsIndex]);

  useEffect(() => {
    if (items && locationFetched && pointLatLong) {
      setState((statePrev) => ({
        ...statePrev,
        findingMinDistanceItems: true,
        minDistance: NaN,
        minDistanceItems: null,
      }));
      const { minDistance, minDistanceItems } = findItemsWithMinDistance();
      setState((statePrev) => ({
        ...statePrev,
        minDistance,
        minDistanceItems,
      }));
      console.log("-=-=min distance items", minDistanceItems);
      console.log("===min distance", minDistance);
    }
  }, [items, locationFetched, pointLatLong]);

  return (
    <Portal>
      <Modal visible onDismiss={onDismiss}>
        <VView style={{ height: "100%" }}>
          {!locationFetched && (
            <>
              {wathingLocation && (
                <Text textKey="dataEntry:gettingCurrentLocation" />
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
            </>
          )}
          {locationFetched && (
            <FieldSet headerKey="dataEntry:usingCurrentLocation">
              <FormItem labelKey="dataEntry:coordinate.x">
                {pointLatLong.x}
              </FormItem>
              <FormItem labelKey="dataEntry:coordinate.y">
                {pointLatLong.y}
              </FormItem>
              <FormItem labelKey="dataEntry:coordinate.accuracy">
                {locationAccuracy?.toFixed(2)}
              </FormItem>
            </FieldSet>
          )}
          {minDistanceItems && (
            <>
              <Text
                textKey="dataEntry:minDistanceItemsFound"
                textParams={minDistance}
              />
              <SelectableList
                itemKeyExtractor={(item) => item.uuid}
                itemLabelExtractor={itemLabelFunction}
                items={minDistanceItems}
                onChange={() => {}}
              />
            </>
          )}
          {!wathingLocation && (
            <Button onPress={onDismiss} textKey="common:close" />
          )}
        </VView>
      </Modal>
    </Portal>
  );
};
