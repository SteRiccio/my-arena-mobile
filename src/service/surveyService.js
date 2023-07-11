import { Surveys } from "@openforis/arena-core";

import { SurveyRepository } from "./repository/surveyRepository";
import { RemoteService } from "./remoteService";
import demoSurvey from "./simple_survey.json";

const {
  fetchSurveySummaries: fetchSurveySummariesLocal,
  fetchSurveyById,
  insertSurvey,
  updateSurvey,
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
    const { data } = await RemoteService.get("api/surveys", { draft: false });
    const { list: surveys } = data;
    return { surveys };
  } catch (error) {
    return RemoteService.handleError({ error });
  }
};

const fetchSurveyRemoteById = async ({ id, cycle = null }) => {
  const { data } = await RemoteService.get(`api/mobile/survey/${id}`, {
    cycle,
  });
  const { survey } = data;
  return survey;
};

const importDemoSurvey = async () => {
  await insertSurvey(demoSurvey);
};

const importSurveyRemote = async ({ id }) => {
  const survey = await fetchSurveyRemoteById({ id });
  return insertSurvey(survey);
};

const updateSurveyRemote = async ({ surveyId, surveyRemoteId }) => {
  const survey = await fetchSurveyRemoteById({ id: surveyRemoteId });
  return updateSurvey({ id: surveyId, survey });
};

export const SurveyService = {
  fetchSurveySummariesLocal,
  fetchSurveySummariesRemote,
  fetchSurveyById,
  importDemoSurvey,
  importSurveyRemote,
  fetchCategoryItems,
  insertSurvey,
  updateSurveyRemote,
  deleteSurveys,
};
