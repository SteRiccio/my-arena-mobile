import { Objects, Records, Surveys } from "@openforis/arena-core";
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

const fetchRecord = async ({ survey, recordId }) => {
  const { id: surveyId } = survey;
  const row = await dbClient.one(
    `SELECT id, uuid, ${keysColumns.join(
      ", "
    )}, date_created, date_modified, content
    FROM record
    WHERE survey_id = ? AND id = ?`,
    [surveyId, recordId]
  );
  return rowToRecord({ survey })(row);
};

const fetchRecords = async ({ survey }) => {
  const { id: surveyId } = survey;

  const rows = await dbClient.many(
    `SELECT id, uuid, ${keysColumns.join(", ")}, date_created, date_modified
    FROM record
    WHERE survey_id = ?`,
    [surveyId]
  );
  return rows.map(rowToRecord({ survey }));
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

const rowToRecord = ({ survey }) => {
  const rootDef = Surveys.getNodeDefRoot({ survey });
  const keyDefs = Surveys.getNodeDefKeys({ survey, nodeDef: rootDef });

  return (row) => {
    if (row.content) {
      return JSON.parse(row.content);
    }
    keysColumns.forEach((keyCol, index) => {
      const keyValue = row[keyCol];
      const keyDef = keyDefs[index];
      if (keyDef) {
        row[keyDef.props.name] = keyValue;
      }
      delete row[keyCol];
    });
    return Objects.camelize(row);
  };
};

export const RecordRepository = {
  fetchRecord,
  fetchRecords,
  insertRecord,
  updateRecord,
};
