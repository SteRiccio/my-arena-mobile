import { RecordRepository } from "./repository/recordRepository";

const { fetchRecords, insertRecord, updateRecord } = RecordRepository;

export const RecordService = {
  fetchRecords,
  insertRecord,
  updateRecord,
};
