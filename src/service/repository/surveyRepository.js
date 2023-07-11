import LZString from "lz-string";

import { DbUtils, dbClient } from "db";

const insertSurvey = async (survey) => {
  const surveyJson = JSON.stringify(survey);
  const content = LZString.compressToBase64(surveyJson);

  const { insertId } = await dbClient.executeSql(
    `INSERT INTO survey (server_url, remote_id, uuid, name, label, content, date_created, date_modified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      survey.serverUrl || "localhost",
      survey.id,
      survey.uuid,
      survey.props.name,
      survey.props.labels?.["en"],
      content,
      survey.dateCreated,
      survey.dateModified,
    ]
  );
  survey.remoteId = survey.id;
  survey.id = insertId;
  return survey;
};

const updateSurvey = async ({ id, survey }) => {
  const surveyJson = JSON.stringify(survey);
  const content = LZString.compressToBase64(surveyJson);

  await dbClient.executeSql(
    `UPDATE survey SET name = ?, label = ?, content = ?, date_created = ?, date_modified = ?
     WHERE id = ?`,
    [
      survey.props.name,
      survey.props.labels?.["en"],
      content,
      survey.dateCreated,
      survey.dateModified,
      id,
    ]
  );
  survey.remoteId = survey.id;
  return survey;
};

const fetchSurveyById = async (id) => {
  const row = await dbClient.one(
    "SELECT remote_id, content FROM survey WHERE id = ?",
    [id]
  );
  const { content, remote_id: remoteId } = row;
  const surveyJsonString = LZString.decompressFromBase64(content);
  const survey = JSON.parse(surveyJsonString);
  survey.id = id;
  survey.remoteId = remoteId;
  return survey;
};

const fetchSurveySummaries = async () => {
  const surveys = await dbClient.many(
    `SELECT id, server_url, remote_id, uuid, name, label 
    FROM survey
    ORDER BY name`
  );
  return surveys;
};

const deleteSurveys = async (surveyIds) => {
  await dbClient.executeSql(
    `DELETE FROM survey WHERE id IN (${DbUtils.quoteValues(surveyIds)})`
  );
};

export const SurveyRepository = {
  fetchSurveyById,
  fetchSurveySummaries,
  insertSurvey,
  updateSurvey,
  deleteSurveys,
};
