import {
  DateFormats,
  Dates,
  NodeDefs,
  Objects,
  RecordFixer,
  Records,
  Surveys,
} from "@openforis/arena-core";

import { DbUtils, dbClient } from "db";
import { RecordLoadStatus, RecordOrigin, SurveyDefs } from "model";
import { SystemUtils } from "utils";

const SUPPORTED_KEYS = 5;
const keyColumnNames = Array.from(Array(SUPPORTED_KEYS).keys()).map(
  (keyIdx) => `key${keyIdx + 1}`
);
const insertColumns = [
  "uuid",
  "survey_id",
  "content",
  "date_created",
  "date_modified",
  "date_modified_remote",
  "cycle",
  "owner_uuid",
  "owner_name",
  "load_status",
  "origin",
  ...keyColumnNames,
];
const insertColumnsJoint = insertColumns.join(", ");
const keyColumnNamesJoint = keyColumnNames.join(", ");
const summarySelectFieldsJoint = `id, uuid, date_created, date_modified, date_modified_remote, date_synced, cycle, owner_uuid, owner_name, load_status, origin, ${keyColumnNamesJoint}`;

const extractKeyColumnsValues = ({ survey, record }) => {
  const keyValues = Records.getEntityKeyValues({
    survey,
    cycle: record.cycle,
    record,
    entity: Records.getRoot(record),
  });
  const keyColumnsValues = keyColumnNames.map((_keyCol, idx) => {
    const value = keyValues[idx];
    return value === undefined ? null : JSON.stringify(value);
  });
  return keyColumnsValues;
};

const extractRemoteRecordSummaryKeyColumnsValues = ({
  survey,
  recordSummary,
}) => {
  const { cycle } = recordSummary;
  const keyDefs = SurveyDefs.getRootKeyDefs({ survey, cycle });
  const keyColumnsValues = keyDefs.map((keyDef) => {
    const keyColName = Objects.camelize(NodeDefs.getName(keyDef));
    const value = recordSummary[keyColName];
    return Objects.isEmpty(value) ? null : JSON.stringify(value);
  });
  return keyColumnsValues;
};

const getPlaceholders = (count) =>
  Array.from(Array(count).keys())
    .map(() => "?")
    .join(", ");

const fetchRecord = async ({ survey, recordId, includeContent = true }) => {
  const { id: surveyId } = survey;
  const row = await dbClient.one(
    `SELECT ${summarySelectFieldsJoint}${includeContent ? ", content" : ""}
    FROM record
    WHERE survey_id = ? AND id = ?`,
    [surveyId, recordId]
  );
  return rowToRecord({ survey })(row);
};

const fetchRecordSummary = async ({ survey, recordId }) =>
  fetchRecord({ survey, recordId, includeContent: false });

const fetchRecords = async ({ survey, cycle = null, onlyLocal = true }) => {
  const { id: surveyId } = survey;
  const whereConditions = ["merged_into_record_uuid IS NULL", "survey_id = ?"];
  const queryParams = [surveyId];

  if (!Objects.isEmpty(cycle)) {
    whereConditions.push("cycle = ?");
    queryParams.push(cycle);
  }
  if (onlyLocal) {
    whereConditions.push("origin = ?");
    queryParams.push(RecordOrigin.local);
  }
  const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

  const rows = await dbClient.many(
    `SELECT ${summarySelectFieldsJoint}
    FROM record
    ${whereClause}
    ORDER BY date_modified DESC`,
    queryParams
  );
  return rows.map(rowToRecord({ survey }));
};

const findRecordSummariesByKeys = async ({ survey, cycle, keyValues }) => {
  const { id: surveyId } = survey;
  const keyColumnsConditions = keyColumnNames
    .map((keyCol, index) => {
      const val = keyValues[index];
      return Objects.isNil(val) ? `${keyCol} IS NULL` : `${keyCol} = ?`;
    })
    .join(" AND ");
  const keyColumnsParams = keyColumnNames.reduce((acc, _keyCol, index) => {
    const val = keyValues[index];
    if (!Objects.isNil(val)) {
      acc.push(JSON.stringify(val));
    }
    return acc;
  }, []);

  const rows = await dbClient.many(
    `SELECT ${summarySelectFieldsJoint}
    FROM record
    WHERE survey_id = ? AND cycle = ? AND ${keyColumnsConditions}`,
    [surveyId, cycle, ...keyColumnsParams]
  );
  return rows.map(rowToRecord({ survey }));
};

const fetchRecordsWithEmptyCycle = async ({ survey }) => {
  const { id: surveyId } = survey;

  const rows = await dbClient.many(
    `SELECT ${summarySelectFieldsJoint}
    FROM record
    WHERE survey_id = ? AND cycle IS NULL"}
    ORDER BY date_modified DESC`,
    [surveyId]
  );
  return rows.map(rowToRecord({ survey }));
};

const insertRecord = async ({
  survey,
  record,
  loadStatus = RecordLoadStatus.complete,
}) => {
  const keyColumnsValues = extractKeyColumnsValues({ survey, record });
  const {
    uuid,
    surveyId,
    dateCreated,
    dateModified,
    cycle,
    ownerUuid,
    ownerName,
  } = record;

  const { insertId } = await dbClient.executeSql(
    `INSERT INTO record (${insertColumnsJoint})
    VALUES (${getPlaceholders(insertColumns.length)})`,
    [
      uuid,
      surveyId,
      JSON.stringify(record),
      dateCreated || Date.now(),
      dateModified || Date.now(),
      null,
      cycle,
      ownerUuid,
      ownerName,
      loadStatus,
      RecordOrigin.local,
      ...keyColumnsValues,
    ]
  );
  record.id = insertId;
  return record;
};

const insertRecordSummaries = async ({ survey, cycle, recordSummaries }) => {
  const { id: surveyId } = survey;
  const loadStatus = RecordLoadStatus.summary;
  const origin = RecordOrigin.remote;
  const insertedIds = [];
  await dbClient.transaction(async (tx) => {
    for await (const recordSummary of recordSummaries) {
      const { dateCreated, dateModified, ownerUuid, ownerName, uuid } =
        recordSummary;
      const keyColumnsValues = extractRemoteRecordSummaryKeyColumnsValues({
        survey,
        recordSummary,
      });
      await tx.executeSql(
        `INSERT INTO record (${insertColumnsJoint})
        VALUES (${getPlaceholders(insertColumns.length)})`,
        [
          uuid,
          surveyId,
          {}, // empty content
          fixDatetime(dateCreated),
          fixDatetime(dateModified),
          fixDatetime(dateModified),
          cycle,
          ownerUuid,
          ownerName,
          loadStatus,
          origin,
          ...keyColumnsValues,
        ],
        (t, results) => {
          const { insertId } = results;
          insertedIds.push(insertId);
        },
        (_, error) => {
          throw error;
        }
      );
    }
  });
  return insertedIds;
};

const updateRecordKeysAndDateModifiedWithSummaryFetchedRemotely = async ({
  survey,
  recordSummary,
}) => {
  const { dateModified, ownerUuid, ownerName, uuid } = recordSummary;
  const keyColumnsSet = keyColumnNames
    .map((keyCol) => `${keyCol} = ?`)
    .join(", ");
  const keyColumnsValues = extractRemoteRecordSummaryKeyColumnsValues({
    survey,
    recordSummary,
  });
  return dbClient.executeSql(
    `UPDATE record SET 
      owner_uuid = ?,
      owner_name = ?,
      date_modified_remote = ?, 
      date_synced = ?,
      ${keyColumnsSet} 
    WHERE survey_id = ? AND uuid = ?`,
    [
      ownerUuid,
      ownerName,
      fixDatetime(dateModified),
      Dates.nowFormattedForStorage(),
      ...keyColumnsValues,
      survey.id,
      uuid,
    ]
  );
};

const updateRecordKeysAndContent = async ({
  survey,
  record,
  updateOrigin = false,
  origin = RecordOrigin.local,
}) => {
  const keyColumnsSet = keyColumnNames
    .map((keyCol) => `${keyCol} = ?`)
    .join(", ");
  const keyColumnsValues = extractKeyColumnsValues({ survey, record });
  const dateModifiedColumn =
    origin === RecordOrigin.remote ? "date_modified_remote" : "date_modified";

  return dbClient.executeSql(
    `UPDATE record SET 
      content = ?, 
      ${dateModifiedColumn} = ?, 
      load_status = ?, 
      ${updateOrigin ? "origin = ?," : ""}
      date_synced = ?,
      ${keyColumnsSet} 
    WHERE survey_id = ? AND uuid = ?`,
    [
      JSON.stringify(record),
      record.dateModified || Date.now(),
      RecordLoadStatus.complete,
      ...(updateOrigin ? [origin] : []),
      Dates.nowFormattedForStorage(),
      ...keyColumnsValues,
      survey.id,
      record.uuid,
    ]
  );
};

const updateRecord = async ({ survey, record }) => {
  const recordUpdated = Objects.assocPath({
    obj: record,
    path: ["info", "modifiedWith"],
    value: SystemUtils.getRecordAppInfo(),
  });
  await updateRecordKeysAndContent({
    survey,
    record: recordUpdated,
    updateOrigin: true,
    origin: RecordOrigin.local,
  });
  return recordUpdated;
};

const updateRecordWithContentFetchedRemotely = async ({ survey, record }) =>
  updateRecordKeysAndContent({ survey, record, origin: RecordOrigin.remote });

const updateRecordsDateSync = async ({ surveyId, recordUuids }) => {
  const sql = `UPDATE record 
  SET date_synced = ?
  WHERE survey_id = ? 
    AND uuid IN (${DbUtils.quoteValues(recordUuids)})`;
  return dbClient.executeSql(sql, [Dates.nowFormattedForStorage(), surveyId]);
};

const updateRecordsMergedInto = async ({ surveyId, mergedRecordsMap }) => {
  for await (const [uuid, mergedIntoRecordUuid] of Object.entries(
    mergedRecordsMap
  ))
    await dbClient.transaction(async (tx) => {
      await tx.executeSql(
        `UPDATE record 
         SET merged_into_record_uuid = ? 
         WHERE survey_id =? 
           AND uuid = ?`,
        [mergedIntoRecordUuid, surveyId, uuid]
      );
    });
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

const fixDatetime = (dateStringOrNumber) => {
  if (!dateStringOrNumber) return dateStringOrNumber;

  if (typeof dateStringOrNumber === "number") {
    return Dates.formatForStorage(new Date(dateStringOrNumber));
  }
  const formatFrom = [
    DateFormats.datetimeStorage,
    DateFormats.datetimeDefault,
  ].find((frmt) => Dates.isValidDateInFormat(dateStringOrNumber, frmt));

  if (!formatFrom || formatFrom === DateFormats.datetimeStorage)
    return dateStringOrNumber;

  const parsed = Dates.parse(dateStringOrNumber, formatFrom);
  return Dates.formatForStorage(parsed);
};

const rowToRecord =
  ({ survey }) =>
  (row) => {
    const sideEffect = true;
    const hasToBeFixed = true;
    const { cycle, content } = row;
    const keyDefs = SurveyDefs.getRootKeyDefs({ survey, cycle });
    const hasContent = !Objects.isEmpty(content) && content !== "{}";
    const result = hasContent
      ? JSON.parse(row.content)
      : Objects.camelize(row, { skip: ["content"] });

    result.id = row.id;

    // fix record dates format
    result.dateModified = fixDatetime(result.dateModified);
    result.dateCreated = fixDatetime(result.dateCreated);
    result.dateModifiedRemote = fixDatetime(result.dateModifiedRemote);
    result.dateSynced = fixDatetime(result.dateSynced);

    if (hasContent) {
      if (!result._nodesIndex) {
        // re-create nodes index
        Records.addNodes(Records.getNodes(result), { sideEffect })(result);
      }
      // fix node dates format
      if (hasToBeFixed) {
        Records.getNodesArray(result).forEach((node) => {
          node.dateCreated = fixDatetime(node.dateCreated);
          node.dateModified = fixDatetime(node.dateModified);
        });
        RecordFixer.insertMissingSingleNodes({
          survey,
          record: result,
          sideEffect,
        });
      }
    }
    // camelize key attribute columns
    keyColumnNames.forEach((keyCol, index) => {
      const keyValue = JSON.parse(row[keyCol]);
      const keyDef = keyDefs[index];
      if (keyDef) {
        result[Objects.camelize(keyDef.props.name)] = keyValue;
      }
      delete result[keyCol];
    });

    if (!result.info?.createdWith) {
      result.info = {
        createdWith: SystemUtils.getRecordAppInfo(),
      };
    }
    return result;
  };

export const RecordRepository = {
  fetchRecord,
  fetchRecordSummary,
  fetchRecords,
  findRecordSummariesByKeys,
  fetchRecordsWithEmptyCycle,
  insertRecord,
  insertRecordSummaries,
  updateRecord,
  updateRecordWithContentFetchedRemotely,
  updateRecordKeysAndDateModifiedWithSummaryFetchedRemotely,
  updateRecordsDateSync,
  updateRecordsMergedInto,
  fixRecordCycle,
  deleteRecords,
};
