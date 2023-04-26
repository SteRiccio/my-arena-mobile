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
  try {
    const { data } = await _get("api/surveys", { draft: false });
    const { list: surveys } = data;
    return { surveys };
  } catch (error) {
    if (error.response) {
      const status = error?.response?.status;
      console.log("---status", status);
      const errorKey =
        status === 500
          ? "internal_server_error"
          : status === 401
          ? "invalid_credentials"
          : error.errorMessage;
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
};
