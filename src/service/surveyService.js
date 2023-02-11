import { SurveyRepository } from "./repository/surveyRepository";

const { fetchSurveySummaries, fetchSurveyById, insertSurvey } =
  SurveyRepository;

const fetchCategoryItems = ({
  survey,
  categoryUuid,
  parentItemUuid = null,
}) => {
  const itemUuids = Object.values(
    survey?.refData?.categoryItemUuidIndex?.[categoryUuid]?.[
      parentItemUuid || "null"
    ] || {}
  );
  return itemUuids.map(
    (itemUuid) => survey?.refData?.categoryItemIndex?.[itemUuid]
  );
};

export const SurveyService = {
  fetchSurveySummaries,
  fetchSurveyById,
  fetchCategoryItems,
  insertSurvey,
};
