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

const Separator = () => <Icon source="greater-than" size={10} />;

export const Breadcrumbs = () => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);

  const survey = SurveySelectors.useCurrentSurvey();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const record = DataEntrySelectors.useRecord();
  const currentPageEntity = DataEntrySelectors.useCurrentPageEntity();
  const { entityUuid, parentEntityUuid, entityDef } = currentPageEntity;
  const actualEntityUuid = entityUuid || parentEntityUuid;

  const itemLabelFunction = ({
    nodeDef,
    survey = null,
    record = null,
    entity = null,
    parentEntity = null,
  }) => {
    let label = NodeDefs.getLabelOrName(nodeDef, lang);

    if (NodeDefs.isRoot(nodeDef)) {
      const keyValuesByName = RecordNodes.getEntityKeyValuesByNameFormatted({
        survey,
        record,
        entity,
      });
      return label + `[${Object.values(keyValuesByName)}]`;
    }

    if (NodeDefs.isMultiple(nodeDef) && parentEntity) {
      const siblings = Records.getChildren(parentEntity, nodeDef.uuid)(record);
      const index = siblings.indexOf(entity);
      label += `[${index + 1}]`;
    }
    return label;
  };

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
  }, [entityDef, actualEntityUuid, itemLabelFunction]);

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
    <HView style={styles.container}>
      <ScrollView horizontal ref={scrollViewRef}>
        <HView style={styles.container}>
          {items.map((item, index) => (
            <HView key={item.uuid} style={styles.item}>
              <Button
                labelStyle={styles.itemButtonLabel}
                mode="text"
                onPress={() => onItemPress(item)}
                style={styles.itemButton}
                textKey={item.name}
              />
              {index < items.length - 1 && <Separator />}
            </HView>
          ))}
        </HView>
      </ScrollView>
    </HView>
  );
};
