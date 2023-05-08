import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";

import { CategoryItems, NodeDefs, NodeValues } from "@openforis/arena-core";

import { SurveyService } from "service/surveyService";

import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";

export const useNodeCodeComponentLocalState = ({ parentNodeUuid, nodeDef }) => {
  const dispatch = useDispatch();

  const { nodes } = DataEntrySelectors.useRecordChildNodes({
    parentEntityUuid: parentNodeUuid,
    nodeDef,
  });

  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const survey = SurveySelectors.useCurrentSurvey();

  const items = useMemo(
    () =>
      SurveyService.fetchCategoryItems({
        survey,
        categoryUuid: nodeDef.props.categoryUuid,
        parentItemUuid: null,
      }),
    [survey, nodeDef]
  );

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

  return {
    items,
    itemLabelFunction,
    onItemAdd,
    onItemRemove,
    onSingleValueChange,
    selectedItems,
    selectedItemUuid,
  };
};
