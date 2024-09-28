import React, { useCallback, useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { NodeDefs, Objects, Records, Surveys } from "@openforis/arena-core";

import { RecordNodes } from "model/utils/RecordNodes";
import { SurveySelectors } from "../../../state/survey/selectors";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { Button, HView, Icon } from "../../../components";
import { DataEntryActions } from "../../../state/dataEntry/actions";

import styles from "./styles";

const Separator = () => <Icon source="greater-than" />;

export const Breadcrumbs = () => {
  if (__DEV__) {
    console.log(`rendering Breadcrumbs`);
  }
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);

  const survey = SurveySelectors.useCurrentSurvey();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const currentPageEntity = DataEntrySelectors.useCurrentPageEntity();
  const { entityUuid, parentEntityUuid, entityDef } = currentPageEntity;
  const actualEntityUuid = entityUuid ?? parentEntityUuid;
  const entityDefUuid = entityDef.uuid;

  const itemLabelFunction = useCallback(
    ({ nodeDef, record = null, entity = null, parentEntity = null }) => {
      const nodeDefLabel = NodeDefs.getLabelOrName(nodeDef, lang);

      if (
        NodeDefs.isRoot(nodeDef) ||
        (NodeDefs.isMultiple(nodeDef) && parentEntity)
      ) {
        const keyValuesByName =
          RecordNodes.getEntitySummaryValuesByNameFormatted({
            survey,
            record,
            entity,
            lang,
          });
        return nodeDefLabel + `[${Object.values(keyValuesByName)}]`;
      }
      return nodeDefLabel;
    },
    [lang, survey]
  );

  useEffect(() => {
    // scroll to the end (right) when selected entity changes
    scrollViewRef?.current?.scrollToEnd({ animated: true });
  }, [entityDefUuid]);

  const items = useSelector((state) => {
    if (!actualEntityUuid) return [];

    const record = DataEntrySelectors.selectRecord(state);
    const survey = SurveySelectors.selectCurrentSurvey(state);

    const _items = [];

    if (parentEntityUuid && !entityUuid) {
      _items.push({
        parentEntityUuid,
        entityDefUuid,
        entityUuid: null,
        name: itemLabelFunction({ nodeDef: entityDef }),
      });
    }

    let currentEntity = Records.getNodeByUuid(actualEntityUuid)(record);

    while (currentEntity) {
      const parentEntity = Records.getParent(currentEntity)(record);

      const currentEntityDef = Surveys.getNodeDefByUuid({
        survey,
        uuid: currentEntity.nodeDefUuid,
      });
      const itemName = itemLabelFunction({
        nodeDef: currentEntityDef,
        record,
        parentEntity,
        entity: currentEntity,
      });

      _items.unshift({
        parentEntityUuid: parentEntity?.uuid,
        entityDefUuid: currentEntityDef.uuid,
        entityUuid: currentEntity.uuid,
        name: itemName,
      });

      currentEntity = parentEntity;
    }
    return _items;
  }, Objects.isEqual);

  const onItemPress = useCallback(
    ({ parentEntityUuid, entityDefUuid, entityUuid }) => {
      dispatch(
        DataEntryActions.selectCurrentPageEntity({
          parentEntityUuid,
          entityDefUuid,
          entityUuid,
        })
      );
    },
    [dispatch]
  );

  return (
    <HView style={styles.externalContainer} transparent>
      <ScrollView horizontal ref={scrollViewRef}>
        <HView style={styles.internalContainer} transparent>
          {items.map((item, index) => {
            const isLastItem = index === items.length - 1;
            return (
              <HView key={item.entityDefUuid} style={styles.item} transparent>
                <Button
                  avoidMultiplePress={false}
                  compact
                  labelStyle={styles.itemButtonLabel}
                  mode={isLastItem ? "contained" : "outlined"}
                  onPress={() => onItemPress(item)}
                  style={styles.itemButton}
                  textKey={item.name}
                />
                {!isLastItem && <Separator />}
              </HView>
            );
          })}
        </HView>
      </ScrollView>
    </HView>
  );
};
