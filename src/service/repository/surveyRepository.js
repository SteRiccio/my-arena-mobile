import { dbClient } from "../../db";
import LZString from "lz-string";

const insertSurvey = async (survey) => {
  const surveyJson = JSON.stringify(survey);
  const content = LZString.compressToBase64(surveyJson);

  const { insertId } = await dbClient.executeSql(
    "INSERT INTO survey (server_url, uuid, name, label, content, date_created, date_modified) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      survey.serverUrl || "localhost",
      survey.uuid,
      survey.props.name,
      survey.props.labels?.["en"],
      content,
      survey.dateCreated,
      survey.dateModified,
    ]
  );
  survey.id = insertId;
  return survey;
};

const fetchSurveyById = async (id) => {
  const surveyContentRow = await dbClient.one(
    "SELECT content FROM survey WHERE id = ?",
    [id]
  );
  const content = surveyContentRow.content;
  const surveyJsonString = LZString.decompressFromBase64(content);
  const survey = JSON.parse(surveyJsonString);
  survey.id = id;
  return survey;
};

const fetchSurveySummaries = async () => {
  const surveys = await dbClient.many(
    "SELECT id, server_url, uuid, name, label FROM survey"
  );
  return surveys;
};

export const SurveyRepository = {
  fetchSurveyById,
  fetchSurveySummaries,
  insertSurvey,
};
