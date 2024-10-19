// import { dbClient } from "db";
import { JobMobile } from "model";
// import { RecordFileService } from "service/recordFileService";
import { Files } from "utils";

// const dbUri = Files.documentDirectory + `SQLite/${dbClient.name}`;

export class BackupJob extends JobMobile {
  async execute() {
    await super.onStart();

    // create temp folder
    // const tempFolderUri = await Files.createTempFolder();
    // this.context.tempFolderUri = tempFolderUri;

    // add db file
    // const targetDbUri = Files.path(tempFolderUri, dbClient.name);
    // await Files.copyFile({ from: dbUri, to: targetDbUri });

    // generate zip file
    const outputFileUri = Files.path(
      Files.cacheDirectory,
      `ame_full_backup.zip`
    );
    await Files.zip(Files.documentDirectory, outputFileUri);

    this.context.outputFileUri = outputFileUri;
  }

  async prepareResult() {
    const { outputFileUri } = this.context;
    return { outputFileUri };
  }

  // async onEnd() {
  //   // delete temp folder
  //   const { tempFolderUri } = this.context;
  //   if (tempFolderUri) {
  //     await Files.del(tempFolderUri);
  //   }
  // }
}
