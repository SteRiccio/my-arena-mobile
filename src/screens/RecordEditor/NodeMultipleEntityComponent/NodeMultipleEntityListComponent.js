import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { NodeDefs, Records } from "@openforis/arena-core";

import { Button, DataTable, Text, VView } from "components";
import { SurveyDefs } from "model/utils/SurveyNodeDefs";
import { RecordNodes } from "model/utils/RecordNodes";
import {
  ConfirmActions,
  DataEntryActions,
  DataEntrySelectors,
  DeviceInfoSelectors,
  SurveySelectors,
} from "state";
import { useTranslation } from "localization";

import styles from "./styles";

export const NodeMultipleEntityListComponent = (props) => {
  const { entityDef, parentEntityUuid } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  if (__DEV__) {
    console.log(
      "Rendering NodeMultipleEntityListComponent for " +
        NodeDefs.getName(entityDef)
    );
  }

  const entityDefUuid = entityDef.uuid;
  const survey = SurveySelectors.useCurrentSurvey();
  const record = DataEntrySelectors.useRecord();
  const isTablet = DeviceInfoSelectors.useIsTablet();

  const summaryDefs = SurveyDefs.getEntitySummaryDefs({
    survey,
    record,
    entityDef,
    onlyKeys: false,
    maxSummaryDefs: isTablet ? 5 : 3,
  });
  const parentEntity = Records.getNodeByUuid(parentEntityUuid)(record);
  const entities = Records.getChildren(parentEntity, entityDefUuid)(record);

  const nodeDefLabel = NodeDefs.getLabelOrName(entityDef, lang);

  const onNewPress = () => {
    dispatch(DataEntryActions.addNewEntity);
  };

  const onRowPress = useCallback(
    ({ uuid }) => {
      dispatch(
        DataEntryActions.selectCurrentPageEntity({
          parentEntityUuid,
          entityDefUuid,
          entityUuid: uuid,
        })
      );
    },
    [parentEntityUuid, entityDefUuid]
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
  }, []);

  const entityToRow = (entity) => ({
    key: entity.uuid,
    uuid: entity.uuid,
    ...RecordNodes.getEntitySummaryValuesByNameFormatted({
      survey,
      record,
      entity,
      onlyKeys: false,
      lang,
    }),
  });

  const rows = entities.map(entityToRow);

  return (
    <VView style={styles.container}>
      {rows.length === 0 && (
        <Text textKey="No entities defined" variant="titleMedium" />
      )}
      {rows.length > 0 && (
        <DataTable
          fields={[
            ...summaryDefs.map((keyDef) => ({
              key: NodeDefs.getName(keyDef),
              header: NodeDefs.getLabelOrName(keyDef, lang),
            })),
          ]}
          items={rows}
          onItemPress={onRowPress}
          onDeleteSelectedItemIds={onDeleteSelectedNodeUuids}
          selectable
        />
      )}
      <Button icon="plus" onPress={onNewPress}>
        {t("common:newItemWithParam", { item: nodeDefLabel })}
      </Button>
    </VView>
  );
};
