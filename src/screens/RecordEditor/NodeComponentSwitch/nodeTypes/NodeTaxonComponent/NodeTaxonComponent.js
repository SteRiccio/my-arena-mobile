import { useMemo, useState } from "react";

import { NodeDefs, NodeValues, Objects } from "@openforis/arena-core";

import { Button, Text, VView, View } from "components";
import { Taxa } from "model/Taxa";
import {
  DataEntrySelectors,
  SurveyOptionsSelectors,
  SurveySelectors,
} from "state";

import { useNodeComponentLocalState } from "../../../useNodeComponentLocalState";
import { useItemsFilter } from "../useItemsFilter";
import { useTaxa } from "./useTaxa";
import { NodeTaxonEditDialog } from "./NodeTaxonEditDialog";
import { TaxonPreview } from "./TaxonPreview";
import { RecordEditViewMode } from "model/RecordEditViewMode";
import { NodeTaxonAutocomplete } from "./NodeTaxonAutocomplete";

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
  let taxa = _taxa;
  if (!Objects.isEmpty(nodeDef.propsAdvanced?.itemsFilter)) {
    const record = DataEntrySelectors.useRecord();
    taxa = useItemsFilter({
      survey,
      nodeDef,
      record,
      parentNode,
      items: _taxa,
      alwaysIncludeItemFunction: (item) =>
        [Taxa.unlistedCode, Taxa.unknownCode].includes(item.props.code),
    });
  }

  const selectedTaxon = useMemo(() => {
    if (!value) return null;
    const {
      scientificName, // unlisted scientific name
      vernacularNameUuid,
    } = value;
    const taxon = taxa.find(
      (taxon) =>
        taxon.uuid === NodeValues.getValueTaxonUuid(value) &&
        taxon.vernacularNameUuid === vernacularNameUuid
    );
    return scientificName ? { ...taxon, scientificName } : taxon;
  }, [taxa, value]);

  const selectedTaxonContainerHeight =
    selectedTaxon && selectedTaxon.vernacularName ? 60 : 30;

  return (
    <VView>
      <View style={{ height: selectedTaxonContainerHeight }}>
        {!selectedTaxon && <Text textKey="dataEntry:taxon.taxonNotSelected" />}
        {selectedTaxon && <TaxonPreview taxon={selectedTaxon} />}
      </View>
      {viewMode === RecordEditViewMode.oneNode && (
        <NodeTaxonAutocomplete taxa={taxa} updateNodeValue={updateNodeValue} />
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
