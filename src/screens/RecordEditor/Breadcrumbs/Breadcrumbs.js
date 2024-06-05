import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ScrollView } from "react-native";
import { useDispatch } from "react-redux";

import { NodeDefs, Records, Surveys } from "@openforis/arena-core";

import { RecordNodes } from "model/utils/RecordNodes";
import { SurveySelectors } from "../../../state/survey/selectors";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { Button, HView, Icon } from "../../../components";
import { DataEntryActions } from "../../../state/dataEntry/actions";

import styles from "./styles";

const Separator = () => <Icon source="greater-than" />;

export const Breadcrumbs = () => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);

  const survey = SurveySelectors.useCurrentSurvey();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const record = DataEntrySelectors.useRecord();
  const currentPageEntity = DataEntrySelectors.useCurrentPageEntity();
  const { entityUuid, parentEntityUuid, entityDef } = currentPageEntity;
  const actualEntityUuid = entityUuid || parentEntityUuid;

  const itemLabelFunction = useCallback(
    ({
      nodeDef,
      survey = null,
      record = null,
      entity = null,
      parentEntity = null,
    }) => {
      let label = NodeDefs.getLabelOrName(nodeDef, lang);

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
        return label + `[${Object.values(keyValuesByName)}]`;
      }
      return label;
    },
    [lang]
  );

  useEffect(() => {
    // scroll to the end (right)
    scrollViewRef?.current?.scrollToEnd({ animated: true });
  }, [currentPageEntity]);

  const items = useMemo(() => {
    if (!actualEntityUuid) return [];

    const _items = [];

    if (parentEntityUuid && !entityUuid) {
      _items.push({
        parentEntityUuid,
        entityDefUuid: entityDef.uuid,
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
        survey,
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
  }, [record, entityDef, actualEntityUuid, itemLabelFunction]);

  const onItemPress = ({ parentEntityUuid, entityDefUuid, entityUuid }) => {
    dispatch(
      DataEntryActions.selectCurrentPageEntity({
        parentEntityUuid,
        entityDefUuid,
        entityUuid,
      })
    );
  };

  return (
    <HView style={styles.externalContainer} transparent>
      <ScrollView horizontal ref={scrollViewRef}>
        <HView style={styles.internalContainer} transparent>
          {items.map((item, index) => {
            const isLastItem = index === items.length - 1;
            return (
              <HView key={item.entityDefUuid} style={styles.item} transparent>
                <Button
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
