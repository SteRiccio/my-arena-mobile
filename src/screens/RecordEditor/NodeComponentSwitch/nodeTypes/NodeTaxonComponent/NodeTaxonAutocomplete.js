import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { SelectableListWithFilter } from "components";

import { Taxa } from "model/Taxa";

const itemKeyExtractor = (item) => `${item?.uuid}_${item?.vernacularNameUuid}`;

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

const filterItems =
  ({ unlistedTaxon, unknownTaxon }) =>
  ({ items: taxa, filterInputValue }) => {
    if ((filterInputValue?.trim().length ?? 0) === 0) {
      return [];
    }
    const inputValueParts = extractPartsForSearch(filterInputValue);
    const taxaFiltered = [];
    const limit = 30;
    for (
      let index = 0;
      index < taxa.length && taxaFiltered.length < limit;
      index++
    ) {
      const taxon = taxa[index];

      const { vernacularName } = taxon;
      const { code } = taxon.props;
      const codeForSearch = preparePartForSearch(code);
      const vernacularNameParts = extractPartsForSearch(vernacularName);

      const itemLabel = itemLabelExtractor(taxon);
      const itemLabelParts = extractPartsForSearch(itemLabel);

      const match = inputValueParts.every(
        (inputValuePart) =>
          codeForSearch.startsWith(inputValuePart) ||
          itemLabelParts.some((part) => part.startsWith(inputValuePart)) ||
          vernacularNameParts.some((part) => part.startsWith(inputValuePart))
      );
      if (match) {
        taxaFiltered.push(taxon);
      }
    }
    if (taxaFiltered.length === 0) {
      taxaFiltered.push(unlistedTaxon, unknownTaxon);
    }
    return taxaFiltered;
  };

export const NodeTaxonAutocomplete = (props) => {
  const { selectedTaxon, taxa, updateNodeValue } = props;

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

  return (
    <SelectableListWithFilter
      filterItems={filterItems({ unlistedTaxon, unknownTaxon })}
      itemKeyExtractor={itemKeyExtractor}
      itemLabelExtractor={itemLabelExtractor}
      itemDescriptionExtractor={itemDescriptionExtractor}
      items={taxa}
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedTaxon ? [selectedTaxon] : []}
    />
  );
};

NodeTaxonAutocomplete.propTypes = {
  focusOnMount: PropTypes.bool,
  selectedTaxon: PropTypes.object,
  taxa: PropTypes.array.isRequired,
  updateNodeValue: PropTypes.func.isRequired,
};
