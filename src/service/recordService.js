import { RecordRepository } from "./repository/recordRepository";

const { fetchRecord, fetchRecords, insertRecord, updateRecord } =
  RecordRepository;

export const RecordService = {
  fetchRecord,
  fetchRecords,
  insertRecord,
  updateRecord,
};
