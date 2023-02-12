import { Records } from "@openforis/arena-core";
import { dbClient } from "../../db";

const SUPPORTED_KEYS = 5;
const keysColumns = Array.from(Array(SUPPORTED_KEYS).keys()).map(
  (keyIdx) => `key${keyIdx + 1}`
);

const extractKeyColumnsValues = ({ survey, record }) => {
  const keyValues = Records.getEntityKeyValues({
    survey,
    record,
    entity: Records.getRoot(record),
  });
  const keyColumnsValues = keysColumns.map((_keyCol, idx) => {
    const value = keyValues[idx];
    return value === undefined ? null : JSON.stringify(value);
  });
  return keyColumnsValues;
};

const getPlaceholders = (count) =>
  Array.from(Array(count).keys())
    .map(() => "?")
    .join(", ");

const fetchRecords = async ({ surveyId }) => {
  const rows = await dbClient.many(
    `SELECT uuid, ${keysColumns.join(", ")}, date_created, date_modified
    FROM record
    WHERE survey_id = ?`,
    [surveyId]
  );
  return rows;
};

const insertRecord = async ({ survey, record }) => {
  const keyColumnsValues = extractKeyColumnsValues({ survey, record });

  await dbClient.executeSql(
    `INSERT INTO record (uuid, survey_id, ${keysColumns.join(
      ", "
    )}, content, date_created, date_modified)
    VALUES (?, ?, ${getPlaceholders(SUPPORTED_KEYS)}, ?, ?, ?)`,
    [
      record.uuid,
      record.surveyId,
      ...keyColumnsValues,
      JSON.stringify(record),
      record.dateCreated || Date.now(),
      record.dateModified || Date.now(),
    ]
  );
};

const updateRecord = async ({ survey, record }) => {
  const keyColumnsSet = keysColumns.map((keyCol) => `${keyCol} = ?`).join(", ");
  const keyColumnsValues = extractKeyColumnsValues({ survey, record });

  await dbClient.executeSql(
    `UPDATE record SET content = ?, ${keyColumnsSet} WHERE id = ?`,
    [JSON.stringify(record), ...keyColumnsValues, record.id]
  );
};

export const RecordRepository = {
  fetchRecords,
  insertRecord,
  updateRecord,
};
