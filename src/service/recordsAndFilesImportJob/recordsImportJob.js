import { JobMobile } from "model";
import { Files } from "utils";

import { RecordsExportFile } from "../recordsExportFile";
import { RecordService } from "../recordService";

export class RecordsImportJob extends JobMobile {
  async execute() {
    const { survey, unzippedFolderUri } = this.context;

    const recordsSummaryJsonUri = Files.path(
      unzippedFolderUri,
      RecordsExportFile.recordsSummaryJsonPath
    );
    const recordsSummary = await Files.readJsonFromFile({
      fileUri: recordsSummaryJsonUri,
    });

    this.summary.total = recordsSummary.length;

    for await (const recordUuidAndCycle of recordsSummary) {
      const { uuid: recordUuid } = recordUuidAndCycle;
      const contentPath = Files.path(
        unzippedFolderUri,
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
