import { RecordRepository } from "./repository/recordRepository";

const { fetchRecord, fetchRecords, insertRecord, updateRecord, deleteRecords } =
  RecordRepository;

export const RecordService = {
  fetchRecord,
  fetchRecords,
  insertRecord,
  updateRecord,
  deleteRecords,
};
