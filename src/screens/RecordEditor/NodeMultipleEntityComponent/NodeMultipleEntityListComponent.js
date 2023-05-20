import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { NodeDefs, Records, Surveys } from "@openforis/arena-core";

import { Button, DataTable, Text, VView } from "components";
import {
  ConfirmActions,
  DataEntryActions,
  DataEntrySelectors,
  SurveySelectors,
} from "state";
import { RecordNodes } from "model/utils/RecordNodes";

export const NodeMultipleEntityListComponent = (props) => {
  const dispatch = useDispatch();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const { entityDef, parentEntityUuid } =
    DataEntrySelectors.useCurrentPageEntity();

  if (__DEV__) {
    console.log(
      "Rendering NodeMultipleEntityListComponent for " +
        NodeDefs.getName(entityDef)
    );
  }

  const survey = SurveySelectors.useCurrentSurvey();
  const keyDefs = Surveys.getNodeDefKeys({ survey, nodeDef: entityDef });
  const record = DataEntrySelectors.useRecord();
  const parentEntity = Records.getNodeByUuid(parentEntityUuid)(record);
  const entities = Records.getChildren(parentEntity, entityDef.uuid)(record);

  const nodeDefLabel = NodeDefs.getLabelOrName(entityDef, lang);

  const onNewPress = () => {
    dispatch(DataEntryActions.addNewEntity);
  };

  const onRowPress = useCallback(
    ({ uuid }) => {
      dispatch(
        DataEntryActions.selectCurrentPageEntity({
          parentEntityUuid,
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

  const entityToRow = (entity) => ({
    key: entity.uuid,
    uuid: entity.uuid,
    ...RecordNodes.getEntityKeyValuesByNameFormatted({
      survey,
      record,
      entity,
    }),
  });

  const rows = entities.map(entityToRow);

  return (
    <VView>
      <Button icon="plus" onPress={onNewPress}>
        New {nodeDefLabel}
      </Button>
      {rows.length === 0 && (
        <Text textKey="No entities defined" variant="titleMedium" />
      )}
      {rows.length > 0 && (
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
          selectable
        />
      )}
    </VView>
  );
};
