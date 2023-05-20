import { Surveys } from "@openforis/arena-core";

import { SurveyRepository } from "./repository/surveyRepository";
import { API } from "./api";
import { SettingsService } from "./settingsService";
import demoSurvey from "./simple_survey.json";

const getServerUrl = async () =>
  (await SettingsService.fetchSettings()).serverUrl;

const _get = async (uri, params) => API.get(await getServerUrl(), uri, params);

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

const statusToErrorKey = {
  500: "internal_server_error",
  401: "invalid_credentials",
};

const fetchSurveySummariesRemote = async () => {
  try {
    const { data } = await _get("api/surveys", { draft: false });
    const { list: surveys } = data;
    return { surveys };
  } catch (error) {
    if (error.response) {
      const status = error?.response?.status;
      const errorKey = statusToErrorKey[status] || error.errorMessage;
      return { errorKey };
    } else {
      return { errorKey: "network_error" };
    }
  }
};

const fetchSurveyRemoteById = async ({ id, cycle }) => {
  const { data } = await _get(`api/mobile/survey/${id}`, { cycle });
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
