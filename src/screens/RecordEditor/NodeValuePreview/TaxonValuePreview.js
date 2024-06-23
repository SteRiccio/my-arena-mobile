import React from "react";
import PropTypes from "prop-types";

import { NodeDefs } from "@openforis/arena-core";

import { Text } from "components";
import { useTaxonByNodeValue } from "./useTaxonByNodeValue";

export const TaxonValuePreview = (props) => {
  const { nodeDef, value } = props;

  const taxon = useTaxonByNodeValue({ value });

  if (!taxon) return null;

  const { code, scientificName } = taxon.props;
  const {
    scientificName: scientificNameUnlisted,
    vernacularName,
    vernacularNameLangCode,
  } = taxon;

  const visibleFields = NodeDefs.getVisibleFields(nodeDef);
  const codeVisible = !visibleFields || visibleFields.includes("code");
  const vernacularNameVisible =
    !visibleFields || visibleFields.includes("vernacularName");

  const scientificNameShown = scientificNameUnlisted ?? scientificName;

  const vernacularNamePart =
    !vernacularName || !vernacularNameVisible
      ? ""
      : `
${vernacularName} (${vernacularNameLangCode})`;

  const codePart = codeVisible ? `(${code})` : "";

  return (
    <Text
      numberOfLines={vernacularNamePart ? 2 : 1}
      style={{ flex: 1 }}
      variant="bodyLarge"
    >
      {`${scientificNameShown} ${codePart}${vernacularNamePart}`}
    </Text>
  );
};

TaxonValuePreview.propTypes = {
  nodeDef: PropTypes.object.isRequired,
  taxon: PropTypes.object.isRequired,
};
