import { Files } from "utils";

import { RemoteService } from "./remoteService";

const exportRecordsFromRemoteServer = async ({
  survey,
  cycle,
  recordUuids,
}) => {
  const { remoteId: surveyRemoteId } = survey;
  const params = { cycle, recordUuids };

  const recordsZipFileUri = await RemoteService.getFile(
    `api/survey/${surveyRemoteId}/records/full`
  );

  

  return data;
};

const uploadRecordsToRemoteServer = async ({ survey, cycle, fileUri }) => {
  const surveyRemoteId = survey.remoteId;
  const params = {
    file: {
      uri: fileUri,
      name: "arena-mobile-data.zip",
      type: Files.MIME_TYPES.zip,
    },
    cycle,
    conflictResolutionStrategy: "overwriteIfUpdated",
  };
  const { data } = await RemoteService.postMultipartData(
    `api/mobile/survey/${surveyRemoteId}`,
    params
  );
  const { job } = data;
  return job;
};

export const RecordRemoteService = {
  uploadRecordsToRemoteServer,
};
