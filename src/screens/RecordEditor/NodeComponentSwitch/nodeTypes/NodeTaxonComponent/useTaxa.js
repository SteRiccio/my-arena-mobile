import { useMemo } from "react";

const calculateVernacularNamesCount = (taxon) =>
  Object.values(taxon.vernacularNames).reduce(
    (acc, vernacularNamesArray) => acc + vernacularNamesArray.length,
    0
  );

const addVernacularNameObjectToItems =
  (items, taxonItem) => (vernacularNameObj) => {
    const { name: vernacularName, lang: vernacularNameLangCode } =
      vernacularNameObj.props;
    items.push({
      ...taxonItem,
      vernacularName,
      vernacularNameLangCode,
      vernacularNameUuid: vernacularNameObj.uuid,
    });
  };

export const useTaxa = ({ survey, taxonomyUuid }) => {
  const taxa = useMemo(() => {
    const allTaxa = Object.values(survey.refData?.taxonIndex ?? {});
    return allTaxa.reduce((acc, taxon) => {
      if (taxon.taxonomyUuid !== taxonomyUuid) {
        return acc;
      }
      const taxonItem = {
        ...taxon,
        vernacularNamesCount: calculateVernacularNamesCount(taxon),
      };
      acc.push(taxonItem);
      const vernacularNamesByLang = taxon.vernacularNames;
      const vernacularNamesArray = Object.values(vernacularNamesByLang);
      if (vernacularNamesArray.length > 0) {
        vernacularNamesArray.forEach((vernacularNameObjects) => {
          vernacularNameObjects.forEach(
            addVernacularNameObjectToItems(acc, taxonItem)
          );
        });
      }
      return acc;
    }, []);
  }, [survey, taxonomyUuid]);

  return taxa;
};
