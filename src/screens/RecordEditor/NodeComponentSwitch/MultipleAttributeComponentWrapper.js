import { useDispatch } from "react-redux";

import { NodeDefs } from "@openforis/arena-core";

import { Button, VView } from "components";
import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";

import { SingleAttributeComponentSwitch } from "./SingleAttributeComponentSwitch";

export const MultipleAttributeComponentWrapper = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  if (__DEV__) {
    console.log(
      `rendering MultipleAttributeComponentWrapper for ${nodeDef.props.name} - parentNodeUuid: ${parentNodeUuid}`
    );
  }

  const dispatch = useDispatch();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const { nodes } = DataEntrySelectors.useRecordChildNodes({
    parentEntityUuid: parentNodeUuid,
    nodeDef,
  });

  const nodeDefLabel = NodeDefs.getLabelOrName(nodeDef, lang);

  const onNewPress = () => {
    dispatch(
      DataEntryActions.addNewAttribute({
        nodeDef,
        parentNodeUuid,
      })
    );
  };

  return (
    <VView>
      {nodes.map((node) => (
        <SingleAttributeComponentSwitch
          nodeDef={nodeDef}
          nodeUuid={node.uuid}
          parentNodeUuid={parentNodeUuid}
        />
      ))}
      <Button icon="plus" onPress={onNewPress}>
        New {nodeDefLabel}
      </Button>
    </VView>
  );
};
