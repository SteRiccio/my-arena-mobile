import { useCallback, useMemo } from "react";

import { NodeDefs, NodeValues, Objects } from "@openforis/arena-core";

import { Autocomplete, Text, VView, View } from "components";
import { DataEntrySelectors, SurveySelectors } from "state";
import { useNodeComponentLocalState } from "../../../useNodeComponentLocalState";
import { useItemsFilter } from "../useItemsFilter";
import { useTaxa } from "./useTaxa";

const unlistedCode = "UNL";
const unknownCode = "UNK";

const SelectedTaxon = (props) => {
  const { taxon } = props;
  const { code, scientificName } = taxon.props;
  const {
    scientificName: scientificNameUnlisted,
    vernacularName,
    vernacularNameLangCode,
  } = taxon;

  const vernacularNamePart = vernacularName
    ? `
${vernacularName} (${vernacularNameLangCode})`
    : "";

  return (
    <Text numberOfLines={2} style={{ flex: 1 }} variant="bodyLarge">
      {`${
        scientificNameUnlisted ?? scientificName
      } (${code})${vernacularNamePart}`}
    </Text>
  );
};

const preparePartForSearch = (part) => part.toLocaleLowerCase();

const extractPartsForSearch = (value) =>
  value?.split(" ").map(preparePartForSearch) ?? [];

const filterOptions =
  ({ unlistedTaxon, unknownTaxon }) =>
  (taxa, { getOptionLabel, inputValue }) => {
    if (inputValue.trim().length === 0) {
      return [];
    }
    const inputValueParts = extractPartsForSearch(inputValue);
    const taxaFiltered = taxa.filter((taxon) => {
      const { vernacularName } = taxon;
      const { code } = taxon.props;
      const codeForSearch = preparePartForSearch(code);
      const vernacularNameParts = extractPartsForSearch(vernacularName);

      const optionLabel = getOptionLabel(taxon);
      const optionLabelParts = extractPartsForSearch(optionLabel);
      return inputValueParts.every(
        (inputValuePart) =>
          codeForSearch.startsWith(inputValuePart) ||
          optionLabelParts.some((part) => part.startsWith(inputValuePart)) ||
          vernacularNameParts.some((part) => part.startsWith(inputValuePart))
      );
    });
    if (taxaFiltered.length === 0) {
      taxaFiltered.push(unlistedTaxon, unknownTaxon);
    }
    return taxaFiltered;
  };

const createTaxonValue = ({ taxon, inputValue, unlistedTaxon }) => {
  let value = null;
  if (taxon) {
    value = { taxonUuid: taxon.uuid };
    if (taxon.vernacularNameUuid) {
      value["vernacularNameUuid"] = taxon.vernacularNameUuid;
    }
    if (inputValue && taxon.props.code === unlistedTaxon?.props?.code) {
      // keep unlisted scientific name
      value["scientificName"] = inputValue;
    }
  }
  return value;
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
        [unlistedCode, unknownCode].includes(item.props.code),
    });
  }

  const unlistedTaxon = taxa.find((taxon) => taxon.props.code === unlistedCode);
  const unknownTaxon = taxa.find((taxon) => taxon.props.code === unknownCode);

  const itemLabelExtractor = useCallback((taxon) => {
    const { code, scientificName } = taxon.props;
    return `(${code}) ${scientificName}`;
  }, []);

  const itemDescriptionExtractor = useCallback((taxon) => {
    const { vernacularName, vernacularNameLangCode } = taxon;
    return vernacularName
      ? `${vernacularName} (${vernacularNameLangCode})`
      : undefined;
  }, []);

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
  }, [value]);

  const onSelectedItemsChange = useCallback(
    (selection, inputValue) => {
      const taxon = selection[0];
      const valueNext = createTaxonValue({ taxon, inputValue, unlistedTaxon });
      updateNodeValue(valueNext);
    },
    [updateNodeValue]
  );

  return (
    <VView>
      <View style={{ height: 60 }}>
        {!selectedTaxon && <Text textKey="dataEntry:taxon.taxonNotSelected" />}
        {selectedTaxon && <SelectedTaxon taxon={selectedTaxon} />}
      </View>
      <Autocomplete
        filterOptions={filterOptions({ unlistedTaxon, unknownTaxon })}
        itemKeyExtractor={(item) => `${item?.uuid}_${item?.vernacularNameUuid}`}
        itemLabelExtractor={itemLabelExtractor}
        itemDescriptionExtractor={itemDescriptionExtractor}
        items={taxa}
        onFocus={onFocus}
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={[]}
      />
    </VView>
  );
};
