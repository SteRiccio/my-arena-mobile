import { useDispatch } from "react-redux";

import { NodeDefs } from "@openforis/arena-core";

import { Button, VView } from "components";
import { DataEntryActions, SurveySelectors } from "state";

import { NodeComponentPropTypes } from "./nodeComponentPropTypes";

export const NodeMultipleEntityPreviewComponent = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  if (__DEV__) {
    console.log("rendering NodeMultipleEntityPreviewComponent");
  }

  const dispatch = useDispatch();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  return (
    <VView>
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

NodeMultipleEntityPreviewComponent.propTypes = NodeComponentPropTypes;
