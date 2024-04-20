import { RecordService } from "./recordService";
import { SurveyService } from "./surveyService";

const fixRecordCycle = async () => {
  const surveySummaries = await SurveyService.fetchSurveySummariesLocal();
  for await (const surveySummary of surveySummaries) {
    try {
      const surveyId = surveySummary.id;
      const survey = await SurveyService.fetchSurveyById(surveyId);
      const records = await RecordService.fetchRecords({ survey });
      for await (const recordSummary of records) {
        try {
          const { id: recordId } = recordSummary;
          await RecordService.fixRecordCycle({ survey, recordId });
        } catch (error) {
          // ignore id
        }
      }
    } catch (error) {
      // ignore id
    }
  }
};

const migrateData = async ({ prevDbVersion }) => {
  if (prevDbVersion === 1) {
    await fixRecordCycle();
  }
};

export const DataMigrationService = {
  migrateData,
};
