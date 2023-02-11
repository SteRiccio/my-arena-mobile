import { RecordRepository } from "./repository/recordRepository";

const { insertRecord, updateRecord } = RecordRepository;

export const RecordService = {
  insertRecord,
  updateRecord,
};
