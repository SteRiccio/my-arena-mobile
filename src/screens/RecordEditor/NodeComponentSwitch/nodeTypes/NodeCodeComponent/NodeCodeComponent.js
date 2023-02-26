import { NodeDefType, Objects } from "@openforis/arena-core";
import { useCallback, useMemo } from "react";

import { TextInput } from "../../../../../components";
import { SurveyService } from "../../../../../service/surveyService";
import { SurveySelectors } from "../../../../../state/survey/selectors";
import { useNodeComponentLocalState } from "../../../nodeComponentLocalState";
import { NodeCodeSingleRadioComponent } from "./NodeCodeSingleRadioComponent";

export const NodeCodeComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeCodeComponent for ${nodeDef.props.name}`);
  }
  const { applicable, value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
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

  const onChange = useCallback((itemUuid) => {
    const valueUpdated = { itemUuid };
    updateNodeValue(valueUpdated);
  }, []);

  const editable = !nodeDef.props.readOnly;
  const selectedItemUuid = value?.itemUuid;

  return (
    <NodeCodeSingleRadioComponent
      editable={editable}
      items={items}
      onChange={onChange}
      value={selectedItemUuid}
    />
  );
};
