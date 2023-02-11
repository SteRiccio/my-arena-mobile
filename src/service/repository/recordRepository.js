import { dbClient } from "../../db";

const insertRecord = async (record) => {
  await dbClient.executeSql(
    "INSERT INTO record (uuid, survey_id, content, date_created, date_modified) VALUES (?, ?, ?, ?, ?)",
    [
      record.uuid,
      record.surveyId,
      JSON.stringify(record),
      record.dateCreated || Date.now(),
      record.dateModified || Date.now(),
    ]
  );
};

const updateRecord = async (record) => {
  await dbClient.executeSql("UPDATE record SET content = ? WHERE id = ?", [
    JSON.stringify(record),
    record.id,
  ]);
};

export const RecordRepository = {
  insertRecord,
  updateRecord,
};
