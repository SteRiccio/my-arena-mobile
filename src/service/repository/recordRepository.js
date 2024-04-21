import {
  DateFormats,
  Dates,
  Objects,
  Records,
  Surveys,
} from "@openforis/arena-core";

import { DbUtils, dbClient } from "db";
import { RecordLoadStatus } from "model";
import { SystemUtils } from "utils";

const SUPPORTED_KEYS = 5;
const keysColumns = Array.from(Array(SUPPORTED_KEYS).keys()).map(
  (keyIdx) => `key${keyIdx + 1}`
);
const keyColumnNamesJoint = keysColumns.join(", ");
const summarySelectFieldsJoint = `id, uuid, date_created, date_modified, cycle, owner_uuid, load_status, ${keyColumnNamesJoint}`;

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
    `SELECT ${summarySelectFieldsJoint}, content
    FROM record
    WHERE survey_id = ? AND id = ?`,
    [surveyId, recordId]
  );
  return rowToRecord({ survey })(row);
};

const fetchRecords = async ({ survey, cycle }) => {
  const { id: surveyId } = survey;

  const rows = await dbClient.many(
    `SELECT ${summarySelectFieldsJoint}
    FROM record
    WHERE survey_id = ? AND cycle = ?
    ORDER BY date_modified DESC`,
    [surveyId, cycle]
  );
  return rows.map(rowToRecord({ survey }));
};

const findRecordIdsByKeys = async ({ survey, cycle, keyValues }) => {
  const { id: surveyId } = survey;
  const keyColumnsConditions = keysColumns
    .map((keyCol, index) => {
      const val = keyValues[index];
      return Objects.isNil(val) ? `${keyCol} IS NULL` : `${keyCol} = ?`;
    })
    .join(" AND ");
  const keyColumnsParams = keysColumns.reduce((acc, _keyCol, index) => {
    const val = keyValues[index];
    if (!Objects.isNil(val)) {
      acc.push(JSON.stringify(val));
    }
    return acc;
  }, []);

  const rows = await dbClient.many(
    `SELECT id
    FROM record
    WHERE survey_id = ? AND cycle = ? AND ${keyColumnsConditions}`,
    [surveyId, cycle, ...keyColumnsParams]
  );
  return rows.map((row) => Number(row.id));
};

const insertRecord = async ({
  survey,
  record,
  loadStatus = RecordLoadStatus.complete,
}) => {
  const keyColumnsValues = extractKeyColumnsValues({ survey, record });
  const { uuid, surveyId, dateCreated, dateModified, cycle, ownerUuid } =
    record;
  const { insertId } = await dbClient.executeSql(
    `INSERT INTO record (uuid, survey_id, content, date_created, date_modified, cycle, 
       owner_uuid, load_status, ${keyColumnNamesJoint})
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ${getPlaceholders(SUPPORTED_KEYS)})`,
    [
      uuid,
      surveyId,
      JSON.stringify(record),
      dateCreated || Date.now(),
      dateModified || Date.now(),
      cycle,
      ownerUuid,
      loadStatus,
      ...keyColumnsValues,
    ]
  );
  record.id = insertId;
  return record;
};

const updateRecord = async ({ survey, record }) => {
  record.modifiedWith = SystemUtils.getRecordAppInfo();
  const keyColumnsSet = keysColumns.map((keyCol) => `${keyCol} = ?`).join(", ");
  const keyColumnsValues = extractKeyColumnsValues({ survey, record });

  return dbClient.executeSql(
    `UPDATE record SET content = ?, date_modified = ?, ${keyColumnsSet} WHERE id = ?`,
    [
      JSON.stringify(record),
      record.dateModified || Date.now(),
      ...keyColumnsValues,
      record.id,
    ]
  );
};

const fixRecordCycle = async ({ survey, recordId }) => {
  const record = await fetchRecord({ survey, recordId });
  const { cycle = Surveys.getDefaultCycleKey(survey) } = record;
  return dbClient.executeSql(`UPDATE record SET cycle = ? WHERE id = ?`, [
    cycle,
    recordId,
  ]);
};

const deleteRecords = async ({ surveyId, recordUuids }) => {
  const sql = `DELETE FROM record 
    WHERE survey_id = ? AND uuid IN (${DbUtils.quoteValues(recordUuids)})`;
  return dbClient.executeSql(sql, [surveyId]);
};

const fixDatetime = (dateStr) => {
  if (!dateStr) return dateStr;

  const formatFrom = [
    DateFormats.datetimeStorage,
    DateFormats.datetimeDefault,
  ].find((frmt) => Dates.isValidDateInFormat(dateStr, frmt));

  if (!formatFrom || formatFrom === DateFormats.datetimeStorage) return dateStr;

  const parsed = Dates.parse(dateStr, formatFrom);
  return Dates.formatForStorage(parsed);
};

const rowToRecord = ({ survey }) => {
  const rootDef = Surveys.getNodeDefRoot({ survey });
  const keyDefs = Surveys.getNodeDefKeys({ survey, nodeDef: rootDef });

  return (row) => {
    const result = row.content
      ? JSON.parse(row.content)
      : Objects.camelize(row, { skip: ["content"] });

    result.id = row.id;

    // fix record dates format
    result.dateModified = fixDatetime(result.dateModified);
    result.dateCreated = fixDatetime(result.dateCreated);

    // fix node dates format
    Records.getNodesArray(result).forEach((node) => {
      node.dateCreated = fixDatetime(node.dateCreated);
      node.dateModified = fixDatetime(node.dateModified);
    });

    // camelize key attribute columns
    keysColumns.forEach((keyCol, index) => {
      const keyValue = JSON.parse(row[keyCol]);
      const keyDef = keyDefs[index];
      if (keyDef) {
        result[Objects.camelize(keyDef.props.name)] = keyValue;
      }
      delete result[keyCol];
    });

    if (!result.createdWith) {
      result.createdWith = SystemUtils.getRecordAppInfo();
    }
    return result;
  };
};

export const RecordRepository = {
  fetchRecord,
  fetchRecords,
  findRecordIdsByKeys,
  insertRecord,
  updateRecord,
  fixRecordCycle,
  deleteRecords,
};
