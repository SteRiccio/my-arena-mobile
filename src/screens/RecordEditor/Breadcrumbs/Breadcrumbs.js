import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { NodeDefs, Records, Surveys } from "@openforis/arena-core";

import { SurveySelectors } from "../../../state/survey/selectors";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { Button, HView, Icon, IconButton } from "../../../components";
import { DataEntryActions } from "../../../state/dataEntry/actions";
import { screenKeys } from "../../../navigation/screenKeys";
import styles from "./styles";

const Separator = () => <Icon source="greater-than" size={10} />;

export const Breadcrumbs = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const survey = SurveySelectors.useCurrentSurvey();
  const record = DataEntrySelectors.useRecord();
  const currentPageEntity = DataEntrySelectors.useCurrentPageEntity();
  const { entityUuid, parentEntityUuid, entityDef } = currentPageEntity;
  const actualEntityUuid = entityUuid || parentEntityUuid;

  const items = useMemo(() => {
    if (!actualEntityUuid) return [];

    const _items = [];

    if (parentEntityUuid && !entityUuid) {
      _items.push({ uuid: entityDef.uuid, name: NodeDefs.getName(entityDef) });
    }

    let currentEntity = Records.getNodeByUuid(actualEntityUuid)(record);

    while (currentEntity) {
      const parent = Records.getParent(currentEntity)(record);

      const currentEntityDef = Surveys.getNodeDefByUuid({
        survey,
        uuid: currentEntity.nodeDefUuid,
      });
      let itemName = NodeDefs.getName(currentEntityDef);

      if (NodeDefs.isMultiple(currentEntityDef) && parent) {
        const siblings = Records.getChildren(
          parent,
          currentEntityDef.uuid
        )(record);
        const index = siblings.indexOf(currentEntity);
        itemName += `[${index + 1}]`;
      }
      const item = { uuid: currentEntityDef.uuid, name: itemName };
      _items.unshift(item);

      currentEntity = parent;
    }
    return _items;
  }, [entityDef, actualEntityUuid]);

  const onHomePress = () => navigation.navigate(screenKeys.recordsList);

  const onItemPress = ({ uuid }) => {
    dispatch(DataEntryActions.selectCurrentPageEntity({ entityDefUuid: uuid }));
  };

  return (
    <HView style={styles.container}>
      <IconButton icon="home" onPress={onHomePress} />

      <Separator />

      {items.map((item, index) => (
        <HView key={item.uuid} style={styles.item}>
          <Button
            mode="text"
            textKey={item.name}
            onPress={() => onItemPress(item)}
            style={styles.itemButton}
          />
          {index < items.length - 1 && <Separator />}
        </HView>
      ))}
    </HView>
  );
};
