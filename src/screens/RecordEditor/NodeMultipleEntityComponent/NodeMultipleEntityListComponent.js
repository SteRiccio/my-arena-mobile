import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { NodeDefs, Records } from "@openforis/arena-core";

import { Button, DataTable, Text, VView } from "components";
import { SurveyDefs } from "model/utils/SurveyDefs";
import { RecordNodes } from "model/utils/RecordNodes";
import {
  DataEntryActions,
  DataEntrySelectors,
  DeviceInfoSelectors,
  SurveySelectors,
  useConfirm,
} from "state";
import { useTranslation } from "localization";

import styles from "./styles";

const determineMaxSummaryDefs = ({ isTablet, isLandscape }) => {
  const result = isTablet ? 5 : 3;
  return isLandscape ? result + 2 : result;
};

export const NodeMultipleEntityListComponent = (props) => {
  const { entityDef, parentEntityUuid } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const confirm = useConfirm();

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
  const isLandscape = DeviceInfoSelectors.useOrientationIsLandscape();
  const maxSummaryDefs = determineMaxSummaryDefs({ isTablet, isLandscape });

  const summaryDefs = SurveyDefs.getEntitySummaryDefs({
    survey,
    record,
    entityDef,
    onlyKeys: false,
    maxSummaryDefs,
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

  const onDeleteSelectedNodeUuids = useCallback(async (nodeUuids) => {
    if (
      await confirm({
        messageKey: "dataEntry:confirmDeleteSelectedItems.message",
      })
    ) {
      dispatch(DataEntryActions.deleteNodes(nodeUuids));
    }
  }, []);

  const entityToRow = useCallback(
    (entity) => ({
      key: entity.uuid,
      uuid: entity.uuid,
      ...RecordNodes.getEntitySummaryValuesByNameFormatted({
        survey,
        record,
        entity,
        onlyKeys: false,
        lang,
        summaryDefs,
      }),
    }),
    [survey, record, summaryDefs]
  );

  const rows = entities.map(entityToRow);

  return (
    <VView style={styles.container}>
      {rows.length === 0 && (
        <Text textKey="dataEntry:noEntitiesDefined" variant="titleMedium" />
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
