import React, { useCallback } from "react";

import { Autocomplete } from "components/Autocomplete";
import { Taxa } from "model/Taxa";

const createTaxonValue = ({ taxon, inputValue }) => {
  let value = null;
  if (taxon) {
    value = { taxonUuid: taxon.uuid };
    if (taxon.vernacularNameUuid) {
      value["vernacularNameUuid"] = taxon.vernacularNameUuid;
    }
    if (
      inputValue &&
      [Taxa.unknownCode, Taxa.unlistedCode].includes(taxon.props.code)
    ) {
      // keep scientific name for unlisted/unknown taxa
      value["scientificName"] = inputValue;
    }
  }
  return value;
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

export const NodeTaxonAutocomplete = (props) => {
  const { focusOnMount, taxa, updateNodeValue } = props;

  const unlistedTaxon = taxa.find(
    (taxon) => taxon.props.code === Taxa.unlistedCode
  );
  const unknownTaxon = taxa.find(
    (taxon) => taxon.props.code === Taxa.unknownCode
  );

  const onSelectedItemsChange = useCallback(
    (selection, inputValue) => {
      const taxon = selection[0];
      const valueNext = createTaxonValue({ taxon, inputValue });
      updateNodeValue(valueNext);
    },
    [updateNodeValue]
  );

  const itemKeyExtractor = (item) =>
    `${item?.uuid}_${item?.vernacularNameUuid}`;

  const itemLabelExtractor = (taxon) => {
    const { code, scientificName } = taxon.props;
    return `(${code}) ${scientificName}`;
  };

  const itemDescriptionExtractor = (taxon) => {
    const { vernacularName, vernacularNameLangCode } = taxon;
    return vernacularName
      ? `${vernacularName} (${vernacularNameLangCode})`
      : undefined;
  };

  return (
    <Autocomplete
      filterOptions={filterOptions({ unlistedTaxon, unknownTaxon })}
      focusOnMount={focusOnMount}
      itemKeyExtractor={itemKeyExtractor}
      itemLabelExtractor={itemLabelExtractor}
      itemDescriptionExtractor={itemDescriptionExtractor}
      items={taxa}
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={[]}
    />
  );
};
