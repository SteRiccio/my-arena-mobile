import { useState } from "react";

import { NodeDefs, Records, Surveys } from "@openforis/arena-core";

import { Validations } from "model/utils/Validations";
import { useTranslation } from "localization";

import { DataEntrySelectors } from "state/dataEntry";
import { SurveySelectors } from "state/survey";

import { DataTable, Text, VView } from "components";

import { NodeEditDialog } from "screens/RecordEditor/NodeComponentSwitch/nodeTypes/NodeEditDialog";

import styles from "./styles";

const getNodePath = ({ survey, record, nodeUuid, lang }) => {
  const node = Records.getNodeByUuid(nodeUuid)(record);
  const parts = [];
  Records.visitAncestorsAndSelf(node, (visitedAncestor) => {
    const nodeDef = Surveys.getNodeDefByUuid({
      survey,
      uuid: visitedAncestor.nodeDefUuid,
    });
    if (NodeDefs.isRoot(nodeDef)) {
      return;
    }
    const labelOrName = NodeDefs.getLabelOrName(nodeDef, lang);
    let part = labelOrName;
    if (NodeDefs.isMultiple(nodeDef)) {
      const parent = Records.getParent(visitedAncestor)(record);
      const siblings = Records.getChildren(parent, nodeDef.uuid)(record);
      const index = siblings.indexOf(visitedAncestor);
      part = part + `[${index + 1}]`;
    }
    parts.unshift(part);
  })(record);
  return parts.join(" / ");
};

export const RecordValidationReport = () => {
  const { t } = useTranslation();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const survey = SurveySelectors.useCurrentSurvey();
  const record = DataEntrySelectors.useRecord();
  const [state, setState] = useState({
    editDialogOpen: false,
    dialogNodeDef: null,
    dialogNodeUuid: null,
    dialogParentNodeUuid: null,
  });

  const {
    editDialogOpen,
    dialogNodeDef,
    dialogNodeUuid,
    dialogParentNodeUuid,
  } = state;

  const { validation } = record;

  const items = Object.entries(validation.fields).reduce(
    (acc, [nodeUuid, validationResult]) => {
      const node = Records.getNodeByUuid(nodeUuid)(record);
      if (!node) return acc;

      const nodeDef = Surveys.getNodeDefByUuid({
        survey,
        uuid: node.nodeDefUuid,
      });
      const parentNodeUuid = node.parentUuid;
      const path = getNodePath({ survey, record, nodeUuid, lang });
      const error = Validations.getJointErrorText({
        validation: validationResult,
        t,
        customMessageLang: lang,
      });
      acc.push({ key: nodeUuid, nodeDef, parentNodeUuid, path, error });
      return acc;
    },
    []
  );

  const onRowPress = (item) => {
    const {
      key: dialogNodeUuid,
      nodeDef: dialogNodeDef,
      parentNodeUuid: dialogParentNodeUuid,
    } = item;
    setState({
      editDialogOpen: true,
      dialogNodeDef,
      dialogNodeUuid,
      dialogParentNodeUuid,
    });
  };

  return (
    <VView style={styles.container}>
      {items.length === 0 && (
        <Text
          textKey="dataEntry:validationReport.noErrorsFound"
          variant="titleLarge"
        />
      )}
      {items.length > 0 && (
        <DataTable
          columns={[
            {
              key: "path",
              header: "common:path",
            },
            {
              key: "error",
              header: "common:error",
            },
          ]}
          onItemPress={onRowPress}
          items={items}
        />
      )}
      {editDialogOpen && (
        <NodeEditDialog
          nodeDef={dialogNodeDef}
          nodeUuid={dialogNodeUuid}
          parentNodeUuid={dialogParentNodeUuid}
          onDismiss={() => setState({ editDialogOpen: false })}
        />
      )}
    </VView>
  );
};
