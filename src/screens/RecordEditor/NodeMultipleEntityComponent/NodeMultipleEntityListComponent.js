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
import { ConfirmActions } from "../../../state/confirm/actions";

const EMPTY_VALUE = "---EMPTY---";

export const NodeMultipleEntityListComponent = () => {
  const dispatch = useDispatch();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const { entityDef, parentEntity } = DataEntrySelectors.useCurrentPageEntity();

  if (__DEV__) {
    console.log(
      "Rendering NodeMultipleEntityListComponent for " +
        NodeDefs.getName(entityDef)
    );
  }

  const survey = SurveySelectors.useCurrentSurvey();
  const keyDefs = Surveys.getNodeDefKeys({ survey, nodeDef: entityDef });
  const record = DataEntrySelectors.useRecord();

  const entities = Records.getChildren(parentEntity, entityDef.uuid)(record);

  const nodeDefLabel = NodeDefs.getLabelOrName(entityDef, lang);

  const onNewPress = () => {
    dispatch(DataEntryActions.addNewEntity);
  };

  const onRowPress = useCallback(
    ({ uuid }) => {
      dispatch(
        DataEntryActions.selectCurrentPageEntity({
          entityDefUuid: entityDef.uuid,
          entityUuid: uuid,
        })
      );
    },
    [entityDef]
  );

  const onDeleteSelectedNodeUuids = useCallback((nodeUuids) => {
    dispatch(
      ConfirmActions.show({
        messageKey: "Delete the selected items?",
        onConfirm: () => {
          dispatch(DataEntryActions.deleteNodes(nodeUuids));
        },
      })
    );
  });

  const entityToRow = (entity) => {
    const keyNodes = Records.getEntityKeyNodes({
      survey,
      record,
      entity,
    });
    return {
      key: entity.uuid,
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
        onDeleteSelectedRowIds={onDeleteSelectedNodeUuids}
      />
    </VView>
  );
};
