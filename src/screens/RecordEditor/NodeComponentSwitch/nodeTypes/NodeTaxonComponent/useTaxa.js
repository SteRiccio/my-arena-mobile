import { useMemo } from "react";

export const useTaxa = ({ survey, taxonomyUuid }) => {
  const taxa = useMemo(() => {
    const allTaxa = Object.values(survey.refData?.taxonIndex || {});
    return allTaxa.reduce((acc, taxon) => {
      if (taxon.taxonomyUuid !== taxonomyUuid) {
        return acc;
      }
      acc.push(taxon);
      const vernacularNamesByLang = taxon.vernacularNames;
      const vernacularNamesArray = Object.values(vernacularNamesByLang);
      if (vernacularNamesArray.length > 0) {
        vernacularNamesArray.forEach((vernacularNameObjects) => {
          vernacularNameObjects.forEach((vernacularNameObj) => {
            const { name: vernacularName, lang: vernacularNameLangCode } =
              vernacularNameObj.props;
            acc.push({
              ...taxon,
              vernacularName,
              vernacularNameLangCode,
              vernacularNameUuid: vernacularNameObj.uuid,
            });
          });
        });
      }
      return acc;
    }, []);
  }, [survey, taxonomyUuid]);

  return taxa;
};
