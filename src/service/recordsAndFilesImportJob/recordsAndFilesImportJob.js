import { unzip } from "react-native-zip-archive";

import { JobMobile } from "model";
import { Files } from "utils";

import { RecordsImportJob } from "./recordsImportJob";
import { FilesImportJob } from "./filesImportJob";

export class RecordsAndFilesImportJob extends JobMobile {
  constructor({ survey, user, fileUri }) {
    super({ survey, user, fileUri }, [
      new RecordsImportJob({ survey, user, fileUri }),
      new FilesImportJob({ survey, user, fileUri }),
    ]);
  }

  async onStart() {
    await super.onStart();
    const { fileUri } = this.context;

    const unzippedFolderUri = await Files.createTempFolder();

    await unzip(fileUri, unzippedFolderUri, "UTF-8");

    this.context.unzippedFolderUri = unzippedFolderUri;
  }
}
