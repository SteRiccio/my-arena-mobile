import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";

import { NodeDefs, Objects, Records, Surveys } from "@openforis/arena-core";

import { NavigateToRecordsListButton } from "appComponents/NavigateToRecordsListButton";
import { HView, IconButton, View } from "components";
import { RecordEditViewMode, RecordPageNavigator } from "model";
import {
  DataEntryActions,
  DataEntrySelectors,
  SurveyOptionsSelectors,
  SurveySelectors,
} from "state";

import { NodePageNavigationButton } from "./NodePageNavigationButton";
import { SingleNodeNavigationButton } from "./SingleNodeNavigationButton";

import { useStyles } from "./styles";

export const BottomNavigationBar = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();
  const record = DataEntrySelectors.useRecord();

  const currentEntityPointer = DataEntrySelectors.useCurrentPageEntity();
  const { entityDef, entityUuid, parentEntityUuid } = currentEntityPointer;

  const viewMode = SurveyOptionsSelectors.useRecordEditViewMode();
  const canEditRecord = DataEntrySelectors.useCanEditRecord();

  if (__DEV__) {
    console.log(
      `rendering BottomNavigationBar for ${NodeDefs.getName(entityDef)}`
    );
  }

  const [prevEntityPointer, nextEntityPointer] = useMemo(
    () => [
      RecordPageNavigator.getPrevEntityPointer({
        survey,
        record,
        currentEntityPointer,
      }),
      RecordPageNavigator.getNextEntityPointer({
        survey,
        record,
        currentEntityPointer,
      }),
    ],
    [survey, record, currentEntityPointer]
  );

  const maxCountReached = useMemo(() => {
    const maxCount = NodeDefs.getMaxCount(entityDef);
    if (Objects.isEmpty(maxCount)) return false;

    const parentEntity = parentEntityUuid
      ? Records.getNodeByUuid(parentEntityUuid)(record)
      : null;
    if (!parentEntity) return false;

    const siblings = Records.getChildren(parentEntity, entityDef.uuid)(record);
    return siblings.length >= maxCount;
  }, [record, entityDef, parentEntityUuid]);

  const hasCurrentEntityKeysSpecified = useMemo(() => {
    const keyDefs = Surveys.getNodeDefKeys({ survey, nodeDef: entityDef });
    if (Objects.isEmpty(keyDefs)) return false;

    const entity = entityUuid
      ? Records.getNodeByUuid(entityUuid)(record)
      : null;
    if (!entity) return false;

    const keyValues = Records.getEntityKeyValues({ survey, record, entity });
    return !keyValues.some((keyValue) => Objects.isEmpty(keyValue));
  }, [survey, record, entityDef, entityUuid]);

  const childDefs = DataEntrySelectors.useCurrentPageEntityRelevantChildDefs();
  const activeChildIndex =
    DataEntrySelectors.useCurrentPageEntityActiveChildIndex();

  const onNewPress = useCallback(() => {
    dispatch(DataEntryActions.addNewEntity);
  }, [dispatch]);

  const activeChildIsLastChild = activeChildIndex + 1 === childDefs.length;

  const listOfRecordsButtonVisible =
    NodeDefs.isRoot(entityDef) &&
    (viewMode !== RecordEditViewMode.oneNode || activeChildIndex === 0);

  const pageButtonsVisible = viewMode !== RecordEditViewMode.oneNode;

  const singleNodesButtonsVisible =
    viewMode === RecordEditViewMode.oneNode &&
    childDefs.length > 0 &&
    (!NodeDefs.isMultiple(entityDef) || entityUuid);

  const prevPageButtonVisible = pageButtonsVisible && prevEntityPointer;

  const nextPageButtonVisible =
    pageButtonsVisible &&
    nextEntityPointer &&
    !Objects.isEqual(nextEntityPointer, prevEntityPointer);

  const prevSingleNodeButtonVisible =
    singleNodesButtonsVisible && activeChildIndex > 0;

  const nextSingleNodeButtonVisible =
    singleNodesButtonsVisible &&
    activeChildIndex >= 0 &&
    !activeChildIsLastChild;

  const newButtonVisible =
    canEditRecord &&
    pageButtonsVisible &&
    prevEntityPointer &&
    !!entityUuid &&
    NodeDefs.isMultiple(entityDef) &&
    !NodeDefs.isEnumerate(entityDef) &&
    !maxCountReached &&
    hasCurrentEntityKeysSpecified;

  return (
    <HView style={styles.container}>
      <View transparent>
        {listOfRecordsButtonVisible && <NavigateToRecordsListButton />}
        {prevPageButtonVisible && (
          <NodePageNavigationButton
            icon="chevron-left"
            entityPointer={prevEntityPointer}
          />
        )}
        {prevSingleNodeButtonVisible && (
          <SingleNodeNavigationButton
            icon="chevron-left"
            childDefIndex={activeChildIndex - 1}
          />
        )}
      </View>
      {newButtonVisible && (
        <IconButton
          avoidMultiplePress
          icon="plus"
          mode="contained"
          onPress={onNewPress}
          selected
        />
      )}

      <View transparent>
        {nextPageButtonVisible && (
          <NodePageNavigationButton
            icon="chevron-right"
            entityPointer={nextEntityPointer}
          />
        )}
        {nextSingleNodeButtonVisible && (
          <SingleNodeNavigationButton
            icon="chevron-right"
            childDefIndex={activeChildIndex + 1}
          />
        )}
      </View>
    </HView>
  );
};
