import { useDispatch } from "react-redux";

import { NodeDefs } from "@openforis/arena-core";

import { Button, Text, VView } from "components";
import { DataEntryActions, SurveySelectors } from "state";

export const NodeMultipleEntityPreviewComponent = (props) => {
  const { nodeDef } = props;

  if (__DEV__) {
    console.log("rendering NodeMultipleEntityPreviewComponent");
  }

  const dispatch = useDispatch();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  return (
    <VView>
      <Text>Items: {0}</Text>
      <Button
        textKey={`Edit ${NodeDefs.getLabelOrName(nodeDef, lang)}`}
        onPress={() =>
          dispatch(
            DataEntryActions.selectCurrentPageEntity({
              parentEntityUuid: parentNodeUuid,
              entityDefUuid: nodeDef.uuid,
            })
          )
        }
      />
    </VView>
  );
};
