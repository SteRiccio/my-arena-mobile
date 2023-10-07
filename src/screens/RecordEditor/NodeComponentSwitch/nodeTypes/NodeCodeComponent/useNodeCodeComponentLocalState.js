import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import {
  CategoryItems,
  NodeDefs,
  NodeValues,
  Objects,
  Records,
  Surveys,
} from "@openforis/arena-core";

import { SurveyService } from "service/surveyService";

import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";
import { useItemsFilter } from "../useItemsFilter";

const findParentItemUuid = ({ nodeDef, parentNodeUuid }) => {
  if (!nodeDef.props.parentCodeDefUuid) return null;

  const record = DataEntrySelectors.useRecord();
  const parentNode = Records.getNodeByUuid(parentNodeUuid)(record);
  const parentCodeAttribute = Records.getParentCodeAttribute({
    parentNode,
    nodeDef,
  })(record);
  return parentCodeAttribute
    ? NodeValues.getItemUuid(parentCodeAttribute)
    : null;
};

export const useNodeCodeComponentLocalState = ({ parentNodeUuid, nodeDef }) => {
  const dispatch = useDispatch();

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { nodes } = DataEntrySelectors.useRecordChildNodes({
    parentEntityUuid: parentNodeUuid,
    nodeDef,
  });

  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const survey = SurveySelectors.useCurrentSurvey();
  const categoryUuid = NodeDefs.getCategoryUuid(nodeDef);
  const parentItemUuid = findParentItemUuid({ nodeDef, parentNodeUuid });

  const _items = useMemo(() => {
    const levelIndex = Surveys.getNodeDefCategoryLevelIndex({
      survey,
      nodeDef,
    });
    return levelIndex > 0 && !parentItemUuid
      ? []
      : SurveyService.fetchCategoryItems({
          survey,
          categoryUuid,
          parentItemUuid,
        });
  }, [survey, nodeDef, parentItemUuid]);

  let items = _items;

  if (!Objects.isEmpty(nodeDef.propsAdvanced?.itemsFilter)) {
    const record = DataEntrySelectors.useRecord();
    const parentNode = Records.getNodeByUuid(parentNodeUuid)(record);
    items = useItemsFilter({
      survey,
      nodeDef,
      record,
      parentNode,
      items: _items,
    });
  }
  const selectedItems = useMemo(
    () =>
      items.filter((item) =>
        nodes.some((node) => NodeValues.getItemUuid(node) === item.uuid)
      ),
    [items, nodes]
  );

  const selectedItemUuid =
    selectedItems.length === 1 ? selectedItems[0].uuid : null;

  const itemLabelFunction = useCallback(
    (item) => {
      if (!item) return "";

      const label = CategoryItems.getLabelOrCode(item, lang);
      const code = CategoryItems.getCode(item);
      if (label === code) {
        return code;
      }
      return `${label} (${code})`;
    },
    [nodeDef]
  );

  const onItemAdd = useCallback(
    (itemUuid) => {
      const value = NodeValues.newCodeValue({ itemUuid });
      if (NodeDefs.isSingle(nodeDef)) {
        const node = nodes[0];
        dispatch(
          DataEntryActions.updateAttribute({
            uuid: node.uuid,
            value,
          })
        );
      } else {
        dispatch(
          DataEntryActions.addNewAttribute({
            nodeDef,
            parentNodeUuid,
            value,
          })
        );
      }
    },
    [nodeDef, nodes]
  );

  const onItemRemove = useCallback(
    (itemUuid) => {
      if (NodeDefs.isSingle(nodeDef)) {
        const node = nodes[0];
        dispatch(
          DataEntryActions.updateAttribute({
            uuid: node.uuid,
            value: null,
          })
        );
      } else {
        const nodeToRemove = nodes.find(
          (node) => NodeValues.getItemUuid(node) === itemUuid
        );
        dispatch(DataEntryActions.deleteNodes([nodeToRemove.uuid]));
      }
    },
    [nodeDef, nodes]
  );

  const onSingleValueChange = useCallback(
    (itemUuid) => {
      const node = nodes[0];
      const value = NodeValues.newCodeValue({ itemUuid });
      dispatch(
        DataEntryActions.updateAttribute({
          uuid: node.uuid,
          value,
        })
      );
    },
    [nodes]
  );

  const openEditDialog = () => setEditDialogOpen(true);
  const closeEditDialog = () => setEditDialogOpen(false);

  return {
    closeEditDialog,
    editDialogOpen,
    items,
    itemLabelFunction,
    onItemAdd,
    onItemRemove,
    onSingleValueChange,
    openEditDialog,
    selectedItems,
    selectedItemUuid,
  };
};
