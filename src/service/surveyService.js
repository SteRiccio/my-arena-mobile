import { SurveyRepository } from "./repository/surveyRepository";
import { API } from "./api";
import { SettingsService } from "./settingsService";
import demoSurvey from "./simple_survey.json";

const getServerUrl = async () =>
  (await SettingsService.fetchSettings()).serverUrl;

const {
  fetchSurveySummaries: fetchSurveySummariesLocal,
  fetchSurveyById,
  insertSurvey,
} = SurveyRepository;

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

const fetchSurveySummariesRemote = async () => {
  const {
    data: { list: surveys },
  } = await API.get(await getServerUrl(), "api/surveys", {
    draft: false,
  });
  return surveys.map((survey) => ({ ...survey, label: survey.defaultLabel }));
};

const fetchSurveyRemoteById = async ({ id, cycle }) => {
  const {
    data: { survey },
  } = await API.get(await getServerUrl(), `api/mobile/survey/${id}`, { cycle });
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
};
