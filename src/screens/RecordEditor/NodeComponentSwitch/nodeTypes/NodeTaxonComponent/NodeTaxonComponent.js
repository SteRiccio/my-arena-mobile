import { useCallback, useMemo, useState } from "react";

import { NodeDefs, NodeValues } from "@openforis/arena-core";

import { Autocomplete, Text, VView } from "components";
import { SurveySelectors } from "state/survey";
import { useNodeComponentLocalState } from "screens/RecordEditor/useNodeComponentLocalState";

const SelectedTaxon = (props) => {
  const { taxon } = props;
  const { code, scientificName } = taxon.props;

  return (
    <Text
      style={{ flex: 1, fontSize: 18 }}
      textKey={`(${code}) ${scientificName}`}
    />
  );
};

export const NodeTaxonComponent = (props) => {
  const { nodeDef, nodeUuid, onFocus } = props;

  if (__DEV__) {
    console.log(
      `rendering NodeTaxonComponent for ${NodeDefs.getName(nodeDef)}`
    );
  }

  const { value, updateNodeValue } = useNodeComponentLocalState({
    nodeUuid,
  });

  const survey = SurveySelectors.useCurrentSurvey();

  const taxonomyUuid = NodeDefs.getTaxonomyUuid(nodeDef);

  const taxa = useMemo(() => {
    const allTaxa = Object.values(survey.refData?.taxonIndex || {});
    return allTaxa.filter((taxon) => taxon.taxonomyUuid === taxonomyUuid);
  }, [survey, taxonomyUuid]);

  const itemLabelFunction = (taxon) => {
    const { code, scientificName } = taxon.props;
    return `(${code}) ${scientificName}`;
  };

  const [selectedTaxon, setSelectedTaxon] = useState(
    value &&
      taxa.find((taxon) => taxon.uuid === NodeValues.getValueTaxonUuid(value))
  );

  const onSelectedItemsChange = useCallback((selection) => {
    const selectedTaxonNext = selection[0];
    setSelectedTaxon(selectedTaxonNext);
    updateNodeValue(
      selectedTaxonNext ? { taxonUuid: selectedTaxonNext.uuid } : null
    );
  }, []);

  return (
    <VView>
      {!selectedTaxon && <Text textKey="Taxon not selected" />}
      {selectedTaxon && <SelectedTaxon taxon={selectedTaxon} />}
      <Autocomplete
        itemKeyExtractor={(item) => item?.uuid}
        itemLabelExtractor={itemLabelFunction}
        items={taxa}
        onFocus={onFocus}
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={[]}
      />
    </VView>
  );
};
