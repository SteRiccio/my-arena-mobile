import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

import { NodeDefs } from "@openforis/arena-core";

import { SelectableListWithFilter } from "components";
import { Taxa } from "model";

const alwaysIncludeVernacularNames = false;
const alwaysIncludeSingleVernacularName = true;

const itemKeyExtractor = (item) => `${item?.uuid}_${item?.vernacularNameUuid}`;

const itemLabelExtractor =
  ({ nodeDef }) =>
  (taxon) => {
    const { code, scientificName } = taxon.props;
    const visibleFields = NodeDefs.getVisibleFields(nodeDef);
    const codeVisible = !visibleFields || visibleFields.includes("code");
    const parts = [];
    if (codeVisible) {
      parts.push(`(${code})`);
    }
    parts.push(scientificName);
    return parts.join(" ");
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
  value?.trim()?.split(" ").map(preparePartForSearch) ?? [];

const filterItems =
  ({ nodeDef, unlistedTaxon, unknownTaxon }) =>
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

      const { vernacularName, vernacularNamesCount } = taxon;
      const singleVernacularName = vernacularNamesCount === 1;
      if (
        alwaysIncludeSingleVernacularName &&
        singleVernacularName &&
        !vernacularName
      ) {
        // skip taxon without vernacular name specified
        continue;
      }
      const { code } = taxon.props;
      const codeForSearch = preparePartForSearch(code);
      const vernacularNameParts = extractPartsForSearch(vernacularName);

      const itemLabel = itemLabelExtractor({ nodeDef })(taxon);
      const itemLabelParts = extractPartsForSearch(itemLabel);

      const matchingCode = codeForSearch.startsWith(inputValueParts[0]);
      const matchingLabel = inputValueParts.every((inputValuePart) =>
        itemLabelParts.some((part) => part.startsWith(inputValuePart))
      );
      const matchingVernarcularName = inputValueParts.every((inputValuePart) =>
        vernacularNameParts.some((part) => part.startsWith(inputValuePart))
      );
      if (
        ((matchingCode || matchingLabel) &&
          (alwaysIncludeVernacularNames ||
            !vernacularName ||
            (alwaysIncludeSingleVernacularName && singleVernacularName))) ||
        matchingVernarcularName
      ) {
        taxaFiltered.push(taxon);
      }
    }
    if (taxaFiltered.length === 0) {
      taxaFiltered.push(unlistedTaxon, unknownTaxon);
    }
    return taxaFiltered;
  };

export const NodeTaxonAutocomplete = (props) => {
  const { nodeDef, selectedTaxon, taxa, updateNodeValue } = props;

  const { unlistedTaxon, unknownTaxon } = useMemo(() => {
    let _unlistedTaxon = null;
    let _unknownTaxon = null;

    taxa.forEach((taxon) => {
      if (!_unlistedTaxon && taxon.props.code === Taxa.unlistedCode) {
        _unlistedTaxon = taxon;
      } else if (!_unknownTaxon && taxon.props.code === Taxa.unknownCode) {
        _unknownTaxon = taxon;
      }
    });
    return { unknownTaxon: _unknownTaxon, unlistedTaxon: _unlistedTaxon };
  });

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
      filterItems={filterItems({ nodeDef, unlistedTaxon, unknownTaxon })}
      itemKeyExtractor={itemKeyExtractor}
      itemLabelExtractor={itemLabelExtractor({ nodeDef })}
      itemDescriptionExtractor={itemDescriptionExtractor}
      items={taxa}
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedTaxon ? [selectedTaxon] : []}
    />
  );
};

NodeTaxonAutocomplete.propTypes = {
  nodeDef: PropTypes.object.isRequired,
  selectedTaxon: PropTypes.object,
  taxa: PropTypes.array.isRequired,
  updateNodeValue: PropTypes.func.isRequired,
};
