import { NodeDefs, Surveys } from "@openforis/arena-core";
import { Autocomplete } from "components/Autocomplete";
import { useCallback, useMemo } from "react";
import { SurveySelectors } from "state/survey";

export const NodeTaxonComponent = (props) => {
  const { parentNodeUuid, nodeDef } = props;

  if (__DEV__) {
    console.log(
      `rendering NodeTaxonComponent for ${NodeDefs.getName(nodeDef)}`
    );
  }

  const survey = SurveySelectors.useCurrentSurvey();

  const taxonomyUuid = NodeDefs.getTaxonomyUuid(nodeDef);
  const taxa = useMemo(() => {
    const allTaxa = Object.values(survey.refData?.taxonIndex || {});
    return allTaxa.filter((taxon) => taxon.taxonomyUuid === taxonomyUuid);
  }, [survey]);

  const itemLabelFunction = (taxon) =>
    `(${taxon.props.code}) ${taxon.props.scientificName}`;

  const selectedItems = [];

  const onSelectedItemsChange = useCallback(() => {}, []);

  return (
    <Autocomplete
      itemKeyExtractor={(item) => item?.uuid}
      itemLabelExtractor={itemLabelFunction}
      items={taxa}
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedItems}
    />
  );
};
