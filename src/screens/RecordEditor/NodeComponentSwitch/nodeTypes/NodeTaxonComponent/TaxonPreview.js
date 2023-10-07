import PropTypes from "prop-types";

import { Text } from "components/Text";

export const TaxonPreview = (props) => {
  const { taxon } = props;
  const { code, scientificName } = taxon.props;
  const {
    scientificName: scientificNameUnlisted,
    vernacularName,
    vernacularNameLangCode,
  } = taxon;

  const scientificNameShown = scientificNameUnlisted ?? scientificName;

  const vernacularNamePart = !vernacularName
    ? ""
    : `
${vernacularName} (${vernacularNameLangCode})`;

  return (
    <Text
      numberOfLines={vernacularNamePart ? 2 : 1}
      style={{ flex: 1 }}
      variant="bodyLarge"
    >
      {`${scientificNameShown} (${code})${vernacularNamePart}`}
    </Text>
  );
};

TaxonPreview.propTypes = {
  taxon: PropTypes.object.isRequired,
};
