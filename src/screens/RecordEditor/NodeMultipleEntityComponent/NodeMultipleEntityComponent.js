import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  NodeDefs,
  NodeValueFormatter,
  Records,
  Surveys,
} from "@openforis/arena-core";
import { Button, DataTable, VView } from "../../../components";
import { DataEntryActions } from "../../../state/dataEntry/actions";
import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { SurveySelectors } from "../../../state/survey/selectors";
import { NodeEntityFormComponent } from "../NodeComponentSwitch/nodeTypes/NodeEntityFormComponent";

const EMPTY_VALUE = "---EMPTY---";

export const NodeMultipleEntityComponent = () => {
  const dispatch = useDispatch();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const { nodeDef, node, parentNode } = DataEntrySelectors.useCurrentPageNode();

  console.log(
    "Rendering NodeMultipleEntityComponent for " + NodeDefs.getName(nodeDef)
  );

  const nodeUuid = node?.uuid;

  const survey = SurveySelectors.useCurrentSurvey();
  const keyDefs = Surveys.getNodeDefKeys({ survey, nodeDef });
  const record = DataEntrySelectors.useRecord();

  const entities = Records.getChildren(parentNode, nodeDef.uuid)(record);

  const nodeDefLabel = NodeDefs.getLabelOrName(nodeDef, lang);

  const onNewPress = () => {
    dispatch(DataEntryActions.addNewEntity);
  };

  const onRowPress = useCallback(({ uuid }) => {
    dispatch(
      DataEntryActions.selectCurrentPageNode({
        nodeDefUuid: nodeDef.uuid,
        nodeUuid: uuid,
      })
    );
  }, []);

  if (nodeUuid) {
    return (
      <NodeEntityFormComponent nodeDef={nodeDef} parentNodeUuid={nodeUuid} />
    );
  }

  const entityToRow = (entity) => {
    const keyNodes = Records.getEntityKeyNodes({
      survey,
      record,
      entity,
    });
    return {
      uuid: entity.uuid,
      ...keyDefs.reduce((acc, keyDef, index) => {
        const keyNode = keyNodes[index];
        return {
          ...acc,
          [NodeDefs.getName(keyDef)]:
            NodeValueFormatter.format({
              survey,
              nodeDef: keyDef,
              value: keyNode?.value,
            }) || EMPTY_VALUE,
        };
      }, {}),
    };
  };

  const rows = entities.map(entityToRow);

  return (
    <VView>
      <Button icon="plus" onPress={onNewPress}>
        New {nodeDefLabel}
      </Button>
      <DataTable
        columns={[
          ...keyDefs.map((keyDef) => ({
            key: NodeDefs.getName(keyDef),
            header: NodeDefs.getLabelOrName(keyDef, lang),
          })),
        ]}
        rows={rows}
        onRowPress={onRowPress}
      />
    </VView>
  );
};
