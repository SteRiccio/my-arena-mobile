import { unzip } from "react-native-zip-archive";

import { JobMobile } from "model/JobMobile";
import { Files } from "utils/Files";
import { RecordsExportFile } from "./recordsExportFile";
import { RecordService } from "./recordService";

export class RecordsImportJob extends JobMobile {
  constructor({ survey, recordUuids, user, fileUri }) {
    super({ survey, recordUuids, user, fileUri });
  }

  async execute() {
    const { survey, user, fileUri } = this.context;

    const targetPath = await Files.createTempFolder();

    const unzippedPath = await unzip(fileUri, targetPath, "UTF-8");
    const recordsSummaryJsonUri = Files.path(
      unzippedPath,
      RecordsExportFile.recordsSummaryJsonPath
    );
    const recordsSummary = await Files.readJsonFromFile({
      fileUri: recordsSummaryJsonUri,
    });

    this.summary.total = recordsSummary.length;

    for await (const recordUuidAndCycle of recordsSummary) {
      const { uuid: recordUuid } = recordUuidAndCycle;
      const contentPath = Files.path(
        unzippedPath,
        RecordsExportFile.getRecordContentJsonPath(recordUuid)
      );
      const record = await Files.readJsonFromFile({ fileUri: contentPath });
      if (!record)
        throw new Error(`missing file in archive for record ${recordUuid}`);

      await RecordService.updateRecordWithContentFetchedRemotely({
        survey,
        record,
      });

      this.incrementProcessedItems();
    }
  }
}
