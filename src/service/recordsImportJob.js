import { JobMobile } from "model/JobMobile";

export class RecordsImportJob extends JobMobile {
  constructor({ survey, recordUuids, user }) {
    super({ survey, recordUuids, user });
  }
}
