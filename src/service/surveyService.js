import { Surveys } from "@openforis/arena-core";

import { SurveyRepository } from "./repository/surveyRepository";
import { AbstractService } from "./abstractService";
import demoSurvey from "./simple_survey.json";

const {
  fetchSurveySummaries: fetchSurveySummariesLocal,
  fetchSurveyById,
  insertSurvey,
  deleteSurveys,
} = SurveyRepository;

const fetchCategoryItems = ({
  survey,
  categoryUuid,
  parentItemUuid = null,
}) => {
  const items = Surveys.getCategoryItems({
    survey,
    categoryUuid,
    parentItemUuid,
  });
  items.sort((itemA, itemB) => itemA.props.index - itemB.props.index);
  return items;
};

const fetchSurveySummariesRemote = async () => {
  try {
    const { data } = await AbstractService.get("api/surveys", { draft: false });
    const { list: surveys } = data;
    return { surveys };
  } catch (error) {
    return AbstractService.handleError({ error });
  }
};

const fetchSurveyRemoteById = async ({ id, cycle }) => {
  const { data } = await AbstractService.get(`api/mobile/survey/${id}`, {
    cycle,
  });
  const { survey } = data;
  return survey;
};

const importDemoSurvey = async () => {
  await insertSurvey(demoSurvey);
};

const importSurveyRemote = async ({ id, cycle }) => {
  const survey = await fetchSurveyRemoteById({ id, cycle });
  return insertSurvey(survey);
};

export const SurveyService = {
  fetchSurveySummariesLocal,
  fetchSurveySummariesRemote,
  fetchSurveyById,
  importDemoSurvey,
  importSurveyRemote,
  fetchCategoryItems,
  insertSurvey,
  deleteSurveys,
};
