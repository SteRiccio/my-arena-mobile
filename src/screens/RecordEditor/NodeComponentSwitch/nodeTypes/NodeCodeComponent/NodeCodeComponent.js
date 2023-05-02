import { useCallback, useMemo } from "react";

import { CategoryItems, NodeDefs, NodeValues } from "@openforis/arena-core";

import { SurveyService } from "../../../../../service/surveyService";
import { SurveySelectors } from "../../../../../state/survey/selectors";
import { NodeCodeSingleRadioComponent } from "./NodeCodeSingleRadioComponent";
import { NodeCodeMultipleCheckboxComponent } from "./NodeCodeMultipleCheckboxComponent";
import { useNodeCodeComponentLocalState } from "./useNodeCodeComponentLocalState";

export const NodeCodeComponent = (props) => {
  const { parentNodeUuid, nodeDef } = props;

  if (__DEV__) {
    console.log(`rendering NodeCodeComponent for ${NodeDefs.getName(nodeDef)}`);
  }

  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const { nodes, onItemAdd, onItemRemove } = useNodeCodeComponentLocalState({
    parentNodeUuid,
    nodeDef,
  });

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

  const onSingleValueChange = useCallback(
    (itemUuid) => {
      if (selectedItemUuid) {
        onItemRemove(selectedItemUuid);
      }
      if (itemUuid) {
        onItemAdd(itemUuid);
      }
    },
    [onItemAdd, onItemRemove, selectedItemUuid]
  );

  const itemLabelFunction = useCallback(
    (item) => {
      const label = CategoryItems.getLabelOrCode(item, lang);
      const code = CategoryItems.getCode(item);
      if (label === code) {
        return code;
      }
      return `${label} (${code})`;
    },
    [nodeDef]
  );

  const editable = !NodeDefs.isReadOnly(nodeDef);
  const selectedItemUuid =
    selectedItems.length === 1 ? selectedItems[0].uuid : null;

  if (NodeDefs.isSingle(nodeDef)) {
    return (
      <NodeCodeSingleRadioComponent
        editable={editable}
        itemLabelFunction={itemLabelFunction}
        items={items}
        onChange={onSingleValueChange}
        value={selectedItemUuid}
      />
    );
  }
  return (
    <NodeCodeMultipleCheckboxComponent
      editable={editable}
      itemLabelFunction={itemLabelFunction}
      items={items}
      onItemAdd={onItemAdd}
      onItemRemove={onItemRemove}
      selectedItems={selectedItems}
    />
  );
};
