import React, { useMemo } from "react";
import { useDispatch } from "react-redux";

import { NodeDefs, Records, Surveys } from "@openforis/arena-core";

import { SurveySelectors } from "../../../state/survey/selectors";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { Button, HView, Icon } from "../../../components";
import { DataEntryActions } from "../../../state/dataEntry/actions";

export const Breadcrumbs = () => {
  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();
  const record = DataEntrySelectors.useRecord();
  const currentPageEntity = DataEntrySelectors.useCurrentPageEntity();
  const { entity, parentEntity, entityDef } = currentPageEntity;
  const actualEntity = entity || parentEntity;

  const items = useMemo(() => {
    if (!actualEntity) return [];

    const _items = [];

    if (parentEntity && !entity) {
      _items.push({ uuid: entityDef.uuid, name: NodeDefs.getName(entityDef) });
    }

    let currentEntity = actualEntity;

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
  }, [actualEntity]);

  const onItemPress = (item) => {
    dispatch(
      DataEntryActions.selectCurrentPageEntity({
        entityDefUuid: item.uuid,
      })
    );
  };

  return (
    <HView>
      {items.map((item, index) => (
        <HView style={{ alignItems: "center", gap: 10 }}>
          <Button
            mode="text"
            textKey={item.name}
            onPress={() => onItemPress(item)}
          />
          {index < items.length - 1 && <Icon source="greater-than" size={10} />}
        </HView>
      ))}
    </HView>
  );
};
