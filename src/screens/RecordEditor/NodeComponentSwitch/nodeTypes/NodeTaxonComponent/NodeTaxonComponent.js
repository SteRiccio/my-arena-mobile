import { useState } from "react";
import PropTypes from "prop-types";

import { NodeDefs } from "@openforis/arena-core";

import { Button, Text, VView, View } from "components";
import { RecordEditViewMode } from "model";
import { Taxa } from "model/Taxa";
import { SurveyOptionsSelectors, SurveySelectors } from "state";

import { useNodeComponentLocalState } from "../../../useNodeComponentLocalState";
import { useItemsFilter } from "../useItemsFilter";
import { useTaxa } from "./useTaxa";
import { NodeTaxonEditDialog } from "./NodeTaxonEditDialog";
import { NodeTaxonAutocomplete } from "./NodeTaxonAutocomplete";
import { TaxonValuePreview } from "../../../NodeValuePreview/TaxonValuePreview";
import { useTaxonByNodeValue } from "../../../NodeValuePreview/useTaxonByNodeValue";

export const NodeTaxonComponent = (props) => {
  const { nodeDef, nodeUuid, parentNodeUuid } = props;

  if (__DEV__) {
    console.log(
      `rendering NodeTaxonComponent for ${NodeDefs.getName(nodeDef)}`
    );
  }
  const viewMode = SurveyOptionsSelectors.useRecordEditViewMode();

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const openEditDialog = () => setEditDialogOpen(true);
  const closeEditDialog = () => setEditDialogOpen(false);

  const { value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const survey = SurveySelectors.useCurrentSurvey();

  const taxonomyUuid = NodeDefs.getTaxonomyUuid(nodeDef);

  const _taxa = useTaxa({ survey, taxonomyUuid });
  const taxa = useItemsFilter({
    nodeDef,
    parentNodeUuid,
    items: _taxa,
    alwaysIncludeItemFunction: (item) =>
      [Taxa.unlistedCode, Taxa.unknownCode].includes(item.props.code),
  });

  const selectedTaxon = useTaxonByNodeValue({ value });

  const selectedTaxonContainerHeight = selectedTaxon?.vernacularName ? 60 : 30;

  return (
    <VView>
      <View style={{ height: selectedTaxonContainerHeight }}>
        {selectedTaxon ? (
          <TaxonValuePreview nodeDef={nodeDef} value={value} />
        ) : (
          <Text textKey="dataEntry:taxon.taxonNotSelected" />
        )}
      </View>
      {viewMode === RecordEditViewMode.oneNode && (
        <NodeTaxonAutocomplete
          nodeDef={nodeDef}
          taxa={taxa}
          updateNodeValue={updateNodeValue}
        />
      )}
      {viewMode === RecordEditViewMode.form && (
        <>
          <Button textKey="dataEntry:taxon.search" onPress={openEditDialog} />
          {editDialogOpen && (
            <NodeTaxonEditDialog
              onDismiss={closeEditDialog}
              nodeDef={nodeDef}
              parentNodeUuid={parentNodeUuid}
              selectedTaxon={selectedTaxon}
              taxa={taxa}
              updateNodeValue={updateNodeValue}
            />
          )}
        </>
      )}
    </VView>
  );
};

NodeTaxonComponent.propTypes = {
  nodeDef: PropTypes.object.isRequired,
  nodeUuid: PropTypes.string,
  parentNodeUuid: PropTypes.string,
};
