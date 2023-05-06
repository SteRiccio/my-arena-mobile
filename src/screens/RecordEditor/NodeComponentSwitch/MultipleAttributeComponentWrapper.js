import { useDispatch } from "react-redux";

import { NodeDefs, Nodes } from "@openforis/arena-core";

import { Button, HView, IconButton, VView } from "components";
import {
  ConfirmActions,
  DataEntryActions,
  DataEntrySelectors,
  SurveySelectors,
} from "state";

import { SingleAttributeComponentSwitch } from "./SingleAttributeComponentSwitch";
import { MessageActions } from "state/message";
import { useCallback } from "react";

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

  const onNewPress = useCallback(() => {
    const hasEmptyNodes = nodes.find(Nodes.isValueBlank);
    if (hasEmptyNodes) {
      dispatch(
        MessageActions.setMessage({
          content:
            "Cannot add new value: an empty value already exists. Delete or update it first.",
        })
      );
    } else {
      dispatch(
        DataEntryActions.addNewAttribute({
          nodeDef,
          parentNodeUuid,
        })
      );
    }
  }, [nodes]);

  const onDeletePress = (node) => () => {
    if (!Nodes.isValueBlank(node)) {
      dispatch(ConfirmActions.show({ messageKey: "Delete this value?" }));
    } else {
      dispatch(DataEntryActions.deleteNodes([node.uuid]));
    }
  };

  return (
    <VView>
      {nodes.map((node) => (
        <HView>
          <SingleAttributeComponentSwitch
            nodeDef={nodeDef}
            nodeUuid={node.uuid}
            parentNodeUuid={parentNodeUuid}
            style={{ flex: 1 }}
          />
          <IconButton icon="trash-can-outline" onPress={onDeletePress(node)} />
        </HView>
      ))}
      <Button icon="plus" onPress={onNewPress}>
        New {nodeDefLabel}
      </Button>
    </VView>
  );
};
